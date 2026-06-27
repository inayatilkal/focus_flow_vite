declare const chrome: any;

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: "dashboard.html",
    type: "popup",
    width: 800,
    height: 600
  });
});
