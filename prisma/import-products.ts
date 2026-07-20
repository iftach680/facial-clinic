import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE = "https://6zifcej6jec811b2.public.blob.vercel-storage.com/products/";

const products = [
  { name: "Purifier", img: "purifier.png", price: 150, desc: "ג׳ל ניקוי 250 מ״ל - מנקה לעומק, מפילינג עדין ומרגיע לעור." },
  { name: "Forte", img: "forte.png", price: 355, desc: "טיפול 30 מ״ל - מפעיל, מרגיע ומחדש את העור." },
  { name: "Polisher", img: "polisher.png", price: 355, desc: "טיפול 30 מ״ל - מבהיר, מחדש ומשטח את מרקם העור." },
  { name: "Nourisher 1", img: "nourisher-1.png", price: 240, desc: "קרם 50 מ״ל - מרגיע, מעניק לחות ומזין את העור." },
  { name: "Teacher", img: "teacher.png", price: 355, desc: "טיפול 50 מ״ל - מאזן, מרגיע ומפעיל." },
  { name: "Therapist", img: "therapist.png", price: 355, desc: "טיפול 50 מ״ל - מרגיע, מלחלח ומרפה." },
  { name: "Nourisher 3", img: "nourisher-3.png", price: 260, desc: "קרם 50 מ״ל - מפעיל, מחייה ומרים את מראה העור." },
  { name: "Restore", img: "restore.png", price: 215, desc: "קרם 50 מ״ל - מרפה, מרגיע ומשקם את העור." },
  { name: "Melaclear", img: "melaclear.png", price: 425, desc: "סרום מבהיר 30 מ״ל - מאזן, מחדש ומלחלח." },
  { name: "Melaboost", img: "melaboost.png", price: 425, desc: "סרום מבהיר 30 מ״ל - מאזן, מחדש ומלחלח." },
  { name: "Melanight", img: "melanight.png", price: 555, desc: "סרום לילה מבהיר 30 מ״ל - מחדש, מאזן ומלחלח." },
  { name: "Sunsitive", img: "sunsitive.png", price: 180, desc: "קרם הגנה 50 מ״ל - SPF50 UVA/UVB/IR." },
  { name: "Sunsitive Stay Put Spray", img: "sunsitive-stay-put-spray.png", price: 250, desc: "ספריי הגנה 100 מ״ל - SPF50 UVA/UVB." },
  { name: "Zen Mask 100ml", img: "zen-mask.png", price: 260, desc: "מסכת פנים 100 מ״ל - מנקה רעלים, מרגיעה וסופגת עודפי שמן." },
  { name: "Zen Mask 250ml", img: "zen-mask.png", price: 365, desc: "מסכת פנים 250 מ״ל - מנקה רעלים, מרגיעה וסופגת עודפי שמן." },
  { name: "Vitality Biomask 100ml", img: "vitality-biomask.png", price: 300, desc: "מסכת פנים 100 מ״ל - מחטבת, מרגיעה ומפעילה." },
  { name: "Vitality Biomask 250ml", img: "vitality-biomask.png", price: 400, desc: "מסכת פנים 250 מ״ל - מחטבת, מרגיעה ומפעילה." },
  { name: "Lumacore Serum", img: "lumacore-serum.png", price: 430, desc: "סרום 30 מ״ל - מאחד גוון, משפר ומאזן." },
  { name: "Bluevive Serum", img: "bluevive-serum.png", price: 480, desc: "סרום 30 מ״ל - מפעיל, מחטב ומחייה." },
  { name: "Biotic Serum", img: "biotic-serum.png", price: 390, desc: "סרום 30 מ״ל - מרגיע, מחזק ומאזן." },
  { name: "Phytoplus Serum", img: "phytoplus-serum.png", price: 430, desc: "סרום 30 מ״ל - מאזן, מחייה מחדש ומשדרג." },
  { name: "ערכת הבהרה עם רטינול", img: "melanight.png", price: 1200, desc: "כוללת: Melanight, Melaboost, Purifier, Sunsitive." },
  { name: "ערכת הבהרה ללא רטינול", img: "melaclear.png", price: 990, desc: "כוללת: Melaclear, Polisher, Purifier, Sunsitive." },
  { name: "צמד סאנסיטיב", img: "sunsitive.png", price: 355, desc: "כוללת: Sunsitive, Sunsitive Stay Put Spray." },
  { name: "ערכת אקנה", img: "forte.png", price: 1145, desc: "כוללת: Forte, Therapist, Nourisher 1, Purifier, Sunsitive." },
];

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.desc,
        price: p.price,
        imageUrl: BASE + p.img,
        stock: 20,
        active: true,
      },
    });
  }

  console.log("Imported", products.length, "products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
