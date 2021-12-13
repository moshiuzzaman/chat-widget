document.getElementsByTagName("BODY")[0].innerHTML += `  <div class="container" >
      <div class="chatbox">
        <div class="chatbox__support chatbox--active">
          <div id="chatbox__chatlists">
            <div id="chatlist__header">
              <h3 id='chatlist__header__text'>Chats</h3>
            </div>
            <div id="all__chatlist">
              <div class="chat__list">
                <div class="friend__icon">
                  <p>F</p>
                </div>
                <div class="chatlist__content">
                  <h4 class="chatlist__friendName">Friend's Name</h4>
                </div>
              </div>
            </div>
            <div class="chatbox__chatlist__footer">
                <div class="chatlist__footer__button"  onclick=backToChatList()>
                  <img src="https://img.icons8.com/ios/50/000000/speech-bubble-with-dots.png"/>
                  <p>Chats</p>
                </div>
                <div class="chatlist__footer__button" onclick=gotoUsers()>
                  <img src="https://img.icons8.com/ios/50/000000/user.png"/>
                  <p>Users</p>
                </div>
                
            </div>
          </div>
          <div id="chatbox__chatting" class="hide__section">
            <div class="chatbox__header">
              <div id="chatbox_backButton--header" onclick=backToChatList()>
                <img src="./images/icons/backArrow.svg" alt="" />
              </div>
              <div class="friend__icon">
                <p>F</p>
              </div>
              <div class="chatbox__content--header">
                <h4 class="chatbox__heading--header">Friend's Name</h4>
              </div>
            </div>
            <div id="chatbox__messages">
              <div>
                <div class="messages__item messages__item--visitor">
                  Can you let me talk to the support?
                </div>
                <div class="messages__item messages__item--operator">Sure!</div>
               
              </div>
            </div>
            <div class="chatbox__footer">
              <img src="./images/icons/attachment.svg" alt="" />
              <input type="text" placeholder="Write a message..." />
              <button class="chatbox__send--footer">Send</button>
            </div>
          </div>
        </div>
        <div class="chatbox__button">
          <button>button</button>
        </div>
        <form id="loginForm">
          <div class="col" style="min-width: 433px; max-width: 443px">
            <div class="card" style="margin-top: 0px; margin-bottom: 0px">
              <div class="row card-content" style="margin-bottom: 0px; margin-top: 10px">
                <div class="input-field">
                  <label>Peer Id</label>
                  <input type="text" placeholder="peer id" id="peerId" />
                </div>
                <div class="input-field channel-padding">
                  <label>Peer Message</label>
                  <input type="text" placeholder="peer message" id="peerMessage" />
                  <button type="button" id="send_peer_message">SEND</button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div id="log"></div>
      </div>
      
    </div>
    
   
    `
    document.getElementsByTagName("BODY")[0].innerHTML += `<script src="./assets/js/demoData.js"></script>`