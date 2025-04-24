const express = require("express");
const axios = require("axios");
const sharp = require("sharp");
const app = express();

app.get("/api/condom", async (req, res) => {
  const avatarURL = req.query.avatar;
  if (!avatarURL) return res.status(400).send("Missing 'avatar' parameter");

  try {
    // Load the meme template
    const template = await axios.get("https://i.imgur.com/cLEixM0.jpg", {
      responseType: "arraybuffer"
    });

    // Load the avatar
    const avatar = await axios.get(avatarURL, {
      responseType: "arraybuffer"
    });

    // Resize avatar and composite it onto the template
    const memeBuffer = await sharp(template.data)
      .resize(512, 512)
      .composite([{ input: await sharp(avatar.data).resize(263, 263).toBuffer(), left: 256, top: 258 }])
      .jpeg()
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(memeBuffer);
  } catch (err) {
    console.error("Error generating meme:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
