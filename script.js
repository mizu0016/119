const sceneScreen = document.getElementById("sceneScreen");
const callScreen = document.getElementById("callScreen");
const sceneImage = document.getElementById("sceneImage");
const callImage = document.getElementById("callImage");

const numberDisplay = document.getElementById("number");
const statusDisplay = document.getElementById("status");
const speechDisplay = document.getElementById("speech");
const keypad = document.getElementById("keypad");

let inputNumber = "";

/* 画像 */
const scenes = ["peg/fire.png", "peg/ambulance_scene.png", "peg/police.png"];

/* 音声 */
const ringtone = new Audio("mp3/ringtone.mp3");
const policeVoice = "mp3/police.wav";
const fireVoice = "mp3/fire.wav";
const askVoice = "mp3/location.wav";
const endVoice = "mp3/end.wav";

/* 初期：ランダム表示 */
window.onload = () => {
  const img = scenes[Math.floor(Math.random() * scenes.length)];
  sceneImage.src = img;
};

/* 次へ */
document.getElementById("nextBtn").onclick = () => {
  sceneScreen.classList.add("hidden");
  callScreen.classList.remove("hidden");
};

/* キー入力 */
document.querySelectorAll(".keys button").forEach(btn => {
  btn.onclick = () => {
    if (inputNumber.length < 3) {
      inputNumber += btn.textContent;
      numberDisplay.textContent = inputNumber;
    }
  };
});

/* 消去 */
document.getElementById("clearBtn").onclick = () => {
  inputNumber = "";
  numberDisplay.textContent = "";
};

/* 発信 */
document.getElementById("callBtn").onclick = async () => {

  if (inputNumber !== "110" && inputNumber !== "119") {
    alert("110か119のみ！");
    return;
  }

  keypad.style.display = "none";
  statusDisplay.textContent = "発信中";

  await playRingtone();

  await playAudio(inputNumber === "110" ? policeVoice : fireVoice);

  const s1 = await recognizeSpeech();
  speechDisplay.textContent = `「${s1}」`;

  await playAudio(askVoice);

  const s2 = await recognizeSpeech();
  speechDisplay.textContent += `\n「${s2}」`;

  await playAudio(endVoice);

  statusDisplay.textContent = "通報終了";
};

/* 音声 */
function playAudio(src) {
  return new Promise(resolve => {
    const audio = new Audio(src);
    audio.onended = resolve;
    audio.play();
  });
}

function playRingtone() {
  return new Promise(resolve => {
    ringtone.loop = true;
    ringtone.play();
    setTimeout(() => {
      ringtone.pause();
      resolve();
    }, 3000);
  });
}

/* 音声認識 */
function recognizeSpeech() {
  return new Promise(resolve => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "ja-JP";
    recognition.start();

    recognition.onresult = e => {
      resolve(e.results[0][0].transcript);
    };

    recognition.onerror = () => resolve("聞き取れませんでした");
  });
}