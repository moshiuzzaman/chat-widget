class InteractiveChatbox {
  constructor(chatToggleButton,  chatbox, icons,  chatSection, chatList) {
    this.args = {
      chatToggleButton: chatToggleButton,
      chatbox: chatbox,
      chatSection,
      chatList,
    };
    this.icons = icons;
    this.showChatbox = false;
    this.isBack = true;
  }

  display() {
    const { chatToggleButton, chatbox,} = this.args;
    chatToggleButton.addEventListener("click", () => this.toggleState(chatbox));
  }

  toggleState(chatbox) {
    this.showChatbox = !this.showChatbox;
    this.showOrHideChatBox(chatbox, this.args.chatToggleButton);
  }

  showOrHideChatBox(chatbox, chatToggleButton) {
    if (this.showChatbox) {
      chatbox.classList.add("cems__chatbox--active");
      this.toggleIcon(true, chatToggleButton);
    } else if (!this.showChatbox) {
      chatbox.classList.remove("cems__chatbox--active");
      this.toggleIcon(false, chatToggleButton);
    }
  }

  toggleIcon(showChatbox, chatToggleButton) {
    const { isClicked, isNotClicked } = this.icons;
    if (showChatbox) {
      chatToggleButton.children[0].innerHTML = isClicked;
    } else if (!showChatbox) {
      chatToggleButton.children[0].innerHTML = isNotClicked;
    }
  }
  gotoChat() {
    const { chatSection, chatList } = this.args;
    this.isBack = !this.isBack;
    if (!this.isBack) {
      chatSection.classList.remove("cems__hide__section");
      chatList.classList.add("cems__hide__section");
    }
  }
  backTochatList() {
    const { chatSection, chatList } = this.args;
    this.isBack = !this.isBack;
    if (this.isBack) {
      chatList.classList.remove("cems__hide__section");
      chatSection.classList.add("cems__hide__section");
    }
  }
}
const chatToggleButton = document.querySelector(".cems__chatbox__button");
const chatContent = document.querySelector(".cems__chatbox__support");
const chatList = document.getElementById("cems__chatbox__chatlists");
const chatSection = document.getElementById("cems__chatbox__chatting");

const icons = {
  isClicked: '<img src="./images/icons/chatbox-icon2.svg" />',
  isNotClicked: '<img src="./images/icons/chatbox-icon.svg" />',
};
const chatbox = new InteractiveChatbox(
  chatToggleButton,
  chatContent,
  icons,
  chatSection,
  chatList
);
chatbox.display();
chatbox.toggleIcon(false, chatToggleButton);
