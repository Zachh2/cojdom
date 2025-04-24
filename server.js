const express = require("express");
const axios = require("axios");
const sharp = require("sharp");

const app = express();

app.get("/", (req, res) => {
  res.send("Condom Meme API is running!");
});

app.get("/api/condom", async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).send("Missing uid");

  const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
  const backgroundURL = "https://i.imgur.com/cLEixM0.jpg";

  try {
    const [avatarRes, bgRes] = await Promise.all([
      axios.get(avatarURL, { responseType: "arraybuffer" }),
      axios.get(backgroundURL, { responseType: "arraybuffer" })
    ]);

    const avatar = await sharp(avatarRes.data).resize(263, 263).toBuffer();
    const bg = await sharp(bgRes.data)
      .resize(512, 512)
      .composite([{ input: avatar, top: 258, left: 256 }])
      .jpeg()
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(bg);
  } catch (err) {
    console.error("Image processing error:", err.message);
    res.status(500).send("Image processing failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
