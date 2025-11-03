import vision from '@google-cloud/vision';
import dotenv from 'dotenv';
dotenv.config();

async function testVision() {
  const client = new vision.ImageAnnotatorClient();
  const imageUrl = 'https://cdn.discordapp.com/attachments/806651577834012697/1431053398467280916/image0.jpg?ex=6909db95&is=69088a15&hm=aa90de6b2e3eeee82af9b58520f8dbf1bd72b552badaefcbc63270c4b420b514&'; // 👈 replace with your actual image URL

  const [result] = await client.textDetection(imageUrl);
  const text = result.textAnnotations?.[0]?.description || 'No text detected';
  console.log('🧠 Extracted text:\n', text);
}

testVision().catch(err => console.error('❌ Vision error:', err));
