let words = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");
let goal = document.getElementById("goalInput");
let visualLayer = document.getElementById("visualLayer");
let textLayer = document.getElementById("textLayer");
let title = document.getElementById("titleInput");
let fontSizeInput = document.getElementById("fontSize"); // was removed
let cpWCStats = document.getElementById("fontSize");
let showVisualiserInput = document.getElementById("showVisualiser")
let showVisualiser = true;
let darkModeButton = document.getElementById("darkModeButton")
let darkModeToggle = true;
let tooltip = document.getElementById("tooltip");
let randomWords = "";

const MAX_GENERATED_WORDS = 5000;


var quill = new Quill(textLayer, {
  theme: 'snow',
  placeholder: "Let's start a new story...",

  modules: {
    toolbar: {
      container: "#controlPanelButtons"
    }
  }
});

function displayMessage(message, isError) {
  if (isError) {
    document.getElementsByClassName("alert")[0].style.backgroundColor = "#f44336"
    timeoutDelay = 3000;
  } else {
    document.getElementsByClassName("alert")[0].style.backgroundColor = "#c2c2c2"
    timeoutDelay = 10000;
  }

  document.getElementsByClassName("alert")[0].style.opacity = 1;
  document.getElementsByClassName("alert")[0].firstElementChild.innerHTML = message;
  setTimeout(() => {
    document.getElementsByClassName("alert")[0].style.opacity = 0;
  }, timeoutDelay)
}

function displayHelpMessage() {
  document.getElementsByClassName("dialog")[0].style.display = (document.getElementsByClassName("dialog")[0].style.display == "block" ? "none" : "block");
}

function getWordCount() {
  s = textLayer.textContent;
  s = s.replace(/(^\s*)|(\s*$)/gi, ""); // scary regex
  s = s.replace(/[ ]{2,}/gi, "");
  s = s.replace(/[ ]/gi, "");
  s = s.replace(/\n /, " ");

  return parseFloat(s.split(' ').filter(function (str) { return str != ""; }).length);
}

function updateStats() {
  if (goal.value != 0 && ((getWordCount() / goal.value) == Infinity || (getWordCount() / goal.value) * 100 > 100 ) ) {
    document.querySelector("#cpStat-percentage").innerHTML = "100%" + " <span style='font-size:10px; color: dark-grey;'>finished!!</span>";
  } else if (goal.value == 0){
    document.querySelector("#cpStat-percentage").innerHTML = " <span style='font-size:10px; color: dark-grey;'>Set a goal!</span>";
  } else {
    document.querySelector("#cpStat-percentage").innerHTML = (Math.floor(getWordCount() / goal.value * 100)) + "%" + " <span style='font-size:10px; color: dark-grey;'>finished</span>";
  }
  document.querySelector("#cpStat-words").innerHTML = getWordCount() + " <span style='font-size:10px; color: dark-grey;'>words</span>";
}

function textContainerUpdated() {
  visualLayer.innerHTML = textLayer.innerHTML + randomWords.slice(textLayer.textContent.length);
  localStorage.setItem("documentContent", textLayer.innerHTML);
  updateStats();
}

function showVisualiserUpdated() {
  if (!showVisualiser) {
    visualLayer.style.opacity = "1";
    showVisualiserInput.style.backgroundColor = "rgb(177, 255, 177)";
  } else {
    visualLayer.style.opacity = "0";
    showVisualiserInput.style.backgroundColor = "rgb(255, 255, 255)";
  }
  showVisualiser = !showVisualiser;
}

function darkModeUpdated(c) {
  darkModeToggle = !darkModeToggle;
  localStorage.setItem("darkModeToggle", darkModeToggle);
  update()
}

function update() { // Visual update
  if (darkModeToggle === true) {
    document.body.classList.remove("lightmode");
    document.querySelector("#darkModeButton img").src = "darkmode.svg";
  } else {
    document.body.classList.add("lightmode");
    document.querySelector("#darkModeButton img").src = "lightmode.svg";
  }

  updateStats();
  visualLayer.style.backgroundColor = document.getElementById("colourInput").value;
  localStorage.setItem("highlightColour", document.getElementById("colourInput").value);
  localStorage.setItem("documentTitle", title.value);
  localStorage.setItem("documentGoal", goal.value);
}

function visualiseWords() {
  if (goal.value < MAX_GENERATED_WORDS) {
    visualLayer.innerHTML = "";
    randomWords = "";

    for (i = 0; i < goal.value; i++) {
      randomWords += words[Math.floor(Math.random() * words.length) + 1] + " ";
    }

    textContainerUpdated();
  } else {
    displayMessage(`Value is too high. Please keep under ${MAX_GENERATED_WORDS} words.`, true);

  }

}

// document.getElementById("fontSize").value = document.getElementById("fontSize").max;
// document.getElementById("lineHeight").value = document.getElementById("lineHeight").max;
showVisualiser = "true";
document.getElementById("colourInput").value = "#6b6b6b";
document.getElementById("noJs").remove();

if (localStorage.getItem('highlightColour')) {
  document.getElementById("colourInput").value = localStorage.getItem('highlightColour');
}

if (localStorage.getItem('documentContent')) {
  textLayer.innerHTML = localStorage.getItem('documentContent');
  textContainerUpdated();
} else {
  textLayer.innerHTML = "Start writing something here and specify your word count goal down in the control panel below so can visualise how much more to write. All settings also save locally.<br><br>Created by Avoxel284";
}

if (localStorage.getItem('documentTitle')) {
  title.value = localStorage.getItem('documentTitle');
}

if (localStorage.getItem('darkModeToggle')) {
  darkModeToggle = localStorage.getItem('darkModeToggle');
  if (typeof (darkModeToggle) == "string") {
    switch (darkModeToggle) {
      case "true":
        darkModeToggle = true;
        break;

      case "false":
        darkModeToggle = false;
        break;

      default:
        darkModeToggle = true;
    }

  }
}

if (localStorage.getItem('documentGoal')) {
  goal.value = localStorage.getItem('documentGoal');
  visualiseWords();
}

update();

$('span[contenteditable]').keydown(function (e) {
  if (e.keyCode === 13) {
    document.execCommand('insertHTML', false, '<br> <br>');
    return false;
  }
});