// ==UserScript==
// @name         Roblox Play Overlay Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Play button overlay on main page Roblox 💖
// @author       Vadim0102
// @match        https://www.roblox.com/*
// @updateURL    https://raw.githubusercontent.com/Vadim0102/Roblox-Play-Overlay-Button/main/roblox-play-overlay-button.user.js
// @downloadURL  https://raw.githubusercontent.com/Vadim0102/Roblox-Play-Overlay-Button/main/roblox-play-overlay-button.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function extractGameId(href) {
    const match = href.match(/\/games\/(\d+)\//);
    return match ? match[1] : null;
  }

  function addPlayButtonToThumbnail(thumbSpan, gameId) {
    if (!thumbSpan || thumbSpan.querySelector('.play-overlay-wrapper')) return;

    thumbSpan.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.className = 'play-overlay-wrapper';
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.zIndex = '2';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-common-play-game-lg btn-primary-md btn-full-width';
    btn.setAttribute('data-testid', 'play-button');

    const icon = document.createElement('span');
    icon.className = 'icon-common-play';
    btn.appendChild(icon);

    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.style.zIndex = '3';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idNum = parseInt(gameId, 10);
      if (window.Roblox?.GameLauncher?.joinMultiplayerGame) {
        Roblox.GameLauncher.joinMultiplayerGame(idNum);
      } else {
        alert('Roblox.GameLauncher not found!');
      }
    });

    overlay.appendChild(btn);
    thumbSpan.appendChild(overlay);

    thumbSpan.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
    });
    thumbSpan.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
    });
  }

  function processTiles() {
    document.querySelectorAll('a.game-card-link').forEach((aTag) => {
      const href = aTag.getAttribute('href');
      const gameId = extractGameId(href);
      if (!gameId) return;

      const thumbSpan = aTag.querySelector('.thumbnail-2d-container');
      if (thumbSpan) {
        addPlayButtonToThumbnail(thumbSpan, gameId);
      }
    });
  }

  const observer = new MutationObserver(() => processTiles());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', processTiles);
})();
