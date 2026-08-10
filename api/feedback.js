export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  const {
    responseId,
    understood,
    hope,
    returnUse,
    wouldPay,
    comments
  } = req.body || {};

  if (!understood || !hope || !returnUse || !wouldPay) {
    return res.status(400).json({
      error: "Faltan respuestas."
    });
  }

  console.log("EMAIL CELESTIAL BETA FEEDBACK", {
    responseId,
    understood,
    hope,
    returnUse,
    wouldPay,
    comments: String(comments || "").slice(0, 1500)
  });

  return res.status(200).json({
    ok: true
  });
}
