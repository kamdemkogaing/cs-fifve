import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import SftpClient from "ssh2-sftp-client";

// Zugangsdaten aus .env.deploy laden
dotenv.config({
  path: path.resolve(process.cwd(), ".env.deploy"),
});

// Erforderliche Umgebungsvariablen
const requiredVariables = [
  "SFTP_HOST",
  "SFTP_USERNAME",
  "SFTP_PASSWORD",
  "LOCAL_BUILD_DIR",
  "REMOTE_DEPLOY_DIR",
];

// Prüfen, ob alle benötigten Variablen vorhanden sind
for (const variable of requiredVariables) {
  if (!process.env[variable]?.trim()) {
    console.error(`❌ Umgebungsvariable ${variable} fehlt.`);
    console.error(
      "Bitte prüfe deine Datei .env.deploy im Hauptverzeichnis des Projekts.",
    );
    process.exit(1);
  }
}

// Lokalen Build-Ordner bestimmen
const localBuildDirectory = path.resolve(
  process.cwd(),
  process.env.LOCAL_BUILD_DIR.trim(),
);

// Zielordner auf dem IONOS-Webspace
const remoteDeployDirectory = process.env.REMOTE_DEPLOY_DIR.trim();

// SFTP-Port
const sftpPort = Number(process.env.SFTP_PORT || 22);

// Prüfen, ob der Port gültig ist
if (!Number.isInteger(sftpPort) || sftpPort <= 0) {
  console.error("❌ SFTP_PORT ist ungültig.");
  process.exit(1);
}

// Schutz vor versehentlichem Löschen des Server-Hauptverzeichnisses
const forbiddenRemoteDirectories = ["", "/", ".", "./"];

if (forbiddenRemoteDirectories.includes(remoteDeployDirectory)) {
  console.error(
    "❌ REMOTE_DEPLOY_DIR darf nicht auf das Server-Hauptverzeichnis zeigen.",
  );
  console.error("Verwende zum Beispiel: REMOTE_DEPLOY_DIR=/dist_cs");
  process.exit(1);
}

// Prüfen, ob der lokale Build-Ordner existiert
if (!fs.existsSync(localBuildDirectory)) {
  console.error("");
  console.error(`❌ Der lokale Build-Ordner wurde nicht gefunden:`);
  console.error(localBuildDirectory);
  console.error("");
  console.error("Führe zuerst folgenden Befehl aus:");
  console.error("npm run build");
  process.exit(1);
}

// Prüfen, ob der lokale Build-Ordner tatsächlich ein Verzeichnis ist
if (!fs.statSync(localBuildDirectory).isDirectory()) {
  console.error(
    `❌ Der angegebene Build-Pfad ist kein Ordner: ${localBuildDirectory}`,
  );
  process.exit(1);
}

// Prüfen, ob index.html vorhanden ist
const localIndexFile = path.join(localBuildDirectory, "index.html");

if (!fs.existsSync(localIndexFile)) {
  console.error("");
  console.error("❌ Im Build-Ordner wurde keine index.html gefunden.");
  console.error(`Geprüfter Pfad: ${localIndexFile}`);
  console.error("");
  console.error(
    "Bitte prüfe in vite.config.js, ob build.outDir auf dist_cs gesetzt ist.",
  );
  process.exit(1);
}

const sftp = new SftpClient("FIFVE-IONOS-Deployment");

// Hochgeladene Dateien im Terminal anzeigen
sftp.on("upload", (info) => {
  const relativeFilePath = path.relative(localBuildDirectory, info.source);

  console.log(`⬆ Hochgeladen: ${relativeFilePath}`);
});

async function deploy() {
  let isConnected = false;

  try {
    console.log("");
    console.log("==============================================");
    console.log("🚀 FIFVE-Deployment zu IONOS");
    console.log("==============================================");
    console.log(`📁 Lokaler Ordner: ${localBuildDirectory}`);
    console.log(`🌐 Server:         ${process.env.SFTP_HOST}`);
    console.log(`🔌 Port:           ${sftpPort}`);
    console.log(`📂 Server-Ziel:    ${remoteDeployDirectory}`);
    console.log("");

    // Verbindung zu IONOS herstellen
    await sftp.connect({
      host: process.env.SFTP_HOST.trim(),
      port: sftpPort,
      username: process.env.SFTP_USERNAME.trim(),
      password: process.env.SFTP_PASSWORD,
      readyTimeout: 30000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
    });

    isConnected = true;

    console.log("✅ SFTP-Verbindung hergestellt.");
    console.log("");

    // Prüfen, ob der Zielordner bereits existiert
    const remoteDirectoryExists = await sftp.exists(remoteDeployDirectory);

    if (remoteDirectoryExists) {
      console.log(
        `🧹 Alter Server-Build wird entfernt: ${remoteDeployDirectory}`,
      );

      // Bestehenden Zielordner inklusive Inhalt löschen
      await sftp.rmdir(remoteDeployDirectory, true);

      console.log("✅ Alter Server-Build wurde entfernt.");
    } else {
      console.log(
        "ℹ️ Der Zielordner existiert noch nicht und wird neu erstellt.",
      );
    }

    // Zielordner neu erstellen
    await sftp.mkdir(remoteDeployDirectory, true);

    console.log(`📁 Zielordner wurde erstellt: ${remoteDeployDirectory}`);
    console.log("");
    console.log("⬆ Neuer Build wird hochgeladen ...");
    console.log("");

    // Inhalt von dist_cs nach /dist_cs hochladen
    await sftp.uploadDir(localBuildDirectory, remoteDeployDirectory, {
      useFastput: false,
    });

    console.log("");
    console.log("==============================================");
    console.log("✅ Deployment erfolgreich abgeschlossen");
    console.log("==============================================");
    console.log(
      `✅ Der aktuelle Build wurde nach ${remoteDeployDirectory} übertragen.`,
    );
    console.log("");
  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error("❌ Deployment fehlgeschlagen");
    console.error("==============================================");

    if (error instanceof Error) {
      console.error(`Fehlermeldung: ${error.message}`);
    } else {
      console.error(error);
    }

    console.error("");
    process.exitCode = 1;
  } finally {
    if (isConnected) {
      try {
        await sftp.end();
        console.log("🔒 SFTP-Verbindung wurde geschlossen.");
      } catch {
        console.warn(
          "⚠️ Die SFTP-Verbindung konnte nicht sauber geschlossen werden.",
        );
      }
    }
  }
}

await deploy();
