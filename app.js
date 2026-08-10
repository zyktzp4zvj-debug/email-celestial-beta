const screens = [...document.querySelectorAll(".screen")];
const state = { responseId:null, name:"", email:"", subject:"", letter:"" };

function go(id){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo({top:0, behavior:"smooth"});
}
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));
document.getElementById("startBtn").addEventListener("click", () => go("write"));

for (const el of document.querySelectorAll(".scale")){
  const name = el.dataset.name;
  el.innerHTML = [1,2,3,4,5].map(n => `<label><input type="radio" name="${name}" value="${n}"><span>${n}</span></label>`).join("");
}

function esc(s=""){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function renderResponse(text){
  const safe = esc(text);
  const blocks = safe.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return blocks.map(b => {
    if (/^(📖|🌱|🙏|Para hoy|Una palabra|Una oración|Lo que)/i.test(b)) return `<h3>${b.replace(/\n/g,"<br>")}</h3>`;
    return `<p>${b.replace(/\n/g,"<br>")}</p>`;
  }).join("");
}

document.getElementById("sendBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const letter = document.getElementById("letter").value.trim();
  const ageConsent = document.getElementById("ageConsent").checked;
  const reviewConsent = document.getElementById("reviewConsent").checked;
  const err = document.getElementById("formError");
  err.textContent = "";

  if (!name || !email || !letter) return err.textContent = "Completa tu nombre, email y carta.";
  if (!/^\S+@\S+\.\S+$/.test(email)) return err.textContent = "Escribe un email válido.";
  if (letter.length < 40) return err.textContent = "Tu carta parece muy corta. Escribe con un poco más de detalle.";
  if (!ageConsent) return err.textContent = "Para esta beta debes confirmar que tienes 18 años o más y aceptar el procesamiento de tu carta.";

  state.name=name; state.email=email; state.subject=subject; state.letter=letter;
  go("waiting");

  try{
    const res = await fetch("/api/respond", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,email,subject,letter,reviewConsent})
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || "No pudimos preparar tu respuesta.");

    state.responseId = data.responseId;
    document.getElementById("responseMeta").textContent = `Para: ${name}${subject ? " · Asunto: " + subject : ""}`;
    document.getElementById("responseTitle").textContent = data.title || "Sobre lo que llevas en tu corazón…";
    document.getElementById("responseBody").innerHTML = renderResponse(data.response);
    document.getElementById("emailNote").textContent = data.emailed
      ? "También enviamos esta respuesta a tu correo."
      : "Esta beta te muestra la respuesta aquí. El envío por email se activa al configurar Resend.";
    go("response");
  }catch(e){
    go("write");
    err.textContent = e.message + " Intenta nuevamente.";
  }
});

document.getElementById("anotherBtn").addEventListener("click", () => {
  document.getElementById("subject").value = "";
  document.getElementById("letter").value = "";
  go("write");
});
document.getElementById("surveyBtn").addEventListener("click", () => go("survey"));

document.getElementById("submitSurveyBtn").addEventListener("click", async () => {
  const understood = document.querySelector('input[name="understood"]:checked')?.value;
  const hope = document.querySelector('input[name="hope"]:checked')?.value;
  const returnUse = document.querySelector('input[name="returnUse"]:checked')?.value;
  const wouldPay = document.querySelector('input[name="wouldPay"]:checked')?.value;
  const comments = document.getElementById("comments").value.trim();
  const err = document.getElementById("surveyError");
  err.textContent = "";
  if(!understood || !hope || !returnUse || !wouldPay) return err.textContent = "Responde las cuatro preguntas para continuar.";

  try{
    const res = await fetch("/api/feedback", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({responseId:state.responseId,name:state.name,email:state.email,understood,hope,returnUse,wouldPay,comments})
    });
    if(!res.ok) throw new Error("No pudimos guardar tu opinión.");
    go("thanks");
  }catch(e){ err.textContent = e.message; }
});
