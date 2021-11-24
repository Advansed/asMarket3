
    var defaults = {
      api_token: 'MERCHANT_TOKEN', // public test token
      language: 'en',
      classNamePreloader: 'payment-preloader',
      preloadBorderColor: '#13a024' // РЈСЃС‚Р°РЅР°РІР»РёРІР°РµС‚ С†РІРµС‚ РїСЂРµР»РѕР°РґРµСЂР°. РџРёС€РµС‚СЃСЏ РІ HEX-С„РѕСЂРјР°С‚Рµ.
    };
  
    var options = {};
  
    export function IPAY() {
      if (arguments[0] && typeof arguments[0] === 'object') {
        options = extendDefaults(defaults, arguments[0]);
      }
  
      function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
          // eslint-disable-next-line no-prototype-builtins
          if (Object.prototype.hasOwnProperty.call(properties, property)) {
            source[property] = properties[property];
          }
        }
        return source;
      }
  
      function createPreloader() {
        var preloadBlock = document.createElement('div'),
          preloader = document.createElement('div'),
          style = document.createElement('style'),
          keyFrames =
            '\
              @-webkit-keyframes load8 {\
                  0% {\
                      -webkit-transform: rotate(0deg);\
                      transform: rotate(0deg);\
                  }\
                  100% {\
                      -webkit-transform: rotate(360deg);\
                      transform: rotate(360deg);\
                  }\
              }\
              @keyframes load8 {\
                   0% {\
                        -webkit-transform: rotate(0deg);\
                        transform: rotate(0deg);\
                   }\
                  100% {\
                        -webkit-transform: rotate(360deg);\
                        transform: rotate(360deg);\
                  }\
              }';
  
        preloadBlock.style.cssText =
          'position: fixed; \
          height: 100%;\
          left: 0; \
          top: 0; \
          width: 100%; \
          background-color: rgba(27, 27, 27, 0.3); \
          z-index: 100; \
          display: none; \
          ';
  
        preloader.style.cssText =
          'margin: auto; \
          top: 0; \
          bottom: 0; \
          left: 0; \
          right: 0; \
          border-radius: 50%; \
          width: 9em; \
          height: 9em; \
          font-size: 8px; \
          position: absolute; \
          text-indent: -9999em; \
          border-top: 1.1em solid #fff; \
          border-right: 1.1em solid #fff; \
          border-bottom: 1.1em solid #fff; \
          border-left-width: 1.1em; \
          border-left-style: solid;\
          transform: translateZ(0); \
          -webkit-animation: load8 1s infinite linear;\
          animation: load8 1s infinite linear;\
          ';
  
        preloader.style.borderLeftColor = options.preloadBorderColor;
  
        style.innerHTML = keyFrames;
        document.querySelector('head').appendChild(style);
  
        preloadBlock.className = options.classNamePreloader;
  
        preloadBlock.appendChild(preloader);
        document.body.appendChild(preloadBlock);
  
        return preloadBlock;
      }
  
      if (document.readyState === 'complete' || document.readyState === 'loaded') {
        createPreloader();
      } else {
        document.addEventListener('DOMContentLoaded', createPreloader);
      }
    };
  
    export function ipayCheckout(order, successCallback, failureCallback, errorCallback) {
      var preloader = document.querySelector('.' + options.classNamePreloader);
      preloader.style.display = 'block'; // РџРѕРєР°Р·С‹РІР°РµРј РїСЂРµР»РѕР°РґРµСЂ РїРµСЂРµРґ РјРѕРЅС‚РёСЂРѕРІР°РЅРёРµРј Р°Р№С„СЂРµР№РјР°
      window.addEventListener('message', gotEvent);
  
      function createIframe(order) {
        var iframe = document.createElement('iframe'),
          iframeStyle = iframe.style,
          orderStr = JSON.stringify(order),
          scrollTop = window.pageYOffset + 'px';
  
        iframeStyle.position = 'fixed';
        iframeStyle.top = '0px';
        iframeStyle.right = '0px';
        iframeStyle.bottom = '0px';
        iframeStyle.left = '0px';
        iframeStyle.width = '100%';
        iframeStyle.height = '100%';
        iframeStyle.minHeight = '100vh';
        iframeStyle.border = '0';
        iframeStyle.overflowX = 'hidden';
        iframeStyle.overflowY = 'scroll';
        iframeStyle.zIndex = '10000';
        iframe.id = options.api_token;
//        iframe.src = 'https://3dsec.sberbank.ru/payment/docsite/payform-1.html?token=' + options.api_token + '&modal=true&order=' + encodeURIComponent(orderStr);
        iframe.src = 'https://securepayments.sberbank.ru/payment/docsite/payform-1.html?token=' + options.api_token + '&modal=true&order=' + encodeURIComponent(orderStr);
        iframe.setAttribute('allowfullscreen', ''); // РЅР° Р±СѓРґСѓС‰РµРµ, СЂР°Р·СЂРµС€РµРЅРёРµ РїРѕР»РЅРѕСЌРєСЂР°РЅРЅРѕРіРѕ СЂРµР¶РёРјР° Р°Р№С„СЂРµР№РјР°
        iframe.setAttribute('data-offset', scrollTop);
  
        document.body.insertBefore(iframe, document.body.firstChild);
  
        return iframe;
      }
  
      createIframe(order); // РЎРѕР·РґР°РµРј iframe РІ DOM-РґРµСЂРµРІРµ
  
      var iframe = document.querySelector('iframe');
  
      function gotEvent(e) {
        var data = e.data,
          offset = parseInt(iframe.getAttribute('data-offset')) || window.pageYOffset,
          preloader = document.querySelector('.' + options.classNamePreloader),
          scroll = {
            offset: offset
          };
  
        // Fix chrome bug
        if (typeof e.data === 'string') {
          data = JSON.parse(e.data);
        }
        if (!('type' in data)) {
          return;
        }
        switch (data.type) {
          case 'LOADED':
            // РЎРѕРґРµСЂР¶РёРјРѕРµ iframe Р·Р°РіСЂСѓР·РёР»РѕСЃСЊ
            if (data) {
              scroll = JSON.stringify(scroll);
              window.scrollTo(0, parseInt(offset));
              /**
               * РћС‚СЃС‡РёС‚С‹РІР°РµРј СЃРєСЂРѕР»Р» СЃРІРµСЂС…Сѓ Рё РїРµСЂРµРґР°С‘Рј СЌС‚Сѓ С†РёС„СЂСѓ РІ iframe
               */
              document.getElementById(options.api_token).contentWindow.postMessage(scroll, '*');
              preloader.style.display = 'none'; //СѓР±РёСЂР°РµРј РїСЂРµР»РѕР°РґРµСЂ
            }
            break;
  
          case 'ACS':
            if (data) {
              iframe.style.backgroundColor = '#fff';
              window.scrollTo(0, 0);
            }
            break;
  
          case 'APPROVE':
            iframe.style.backgroundColor = 'transparent';
            window.scrollTo(0, offset);
            successCallback(data.data);
            window.removeEventListener('message', gotEvent);
            break;
  
          case 'DECLINE':
            iframe.style.backgroundColor = 'transparent';
            window.scrollTo(0, offset);
            failureCallback(data.data);
            window.removeEventListener('message', gotEvent);
            break;
  
          case 'ERROR':
            if(errorCallback){
              errorCallback(data.data);
            }
            break;
  
          case 'CLOSE':
            window.removeEventListener('message', gotEvent);
            break;
  
          default:
            console.warn('Incorrect iframe message');
        }
      }
  
      window.addEventListener('message', closeModal);
  
      function closeModal(e) {
        var data = e.data;
        if (typeof e.data === 'string') {
          data = JSON.parse(e.data);
        }
        if (!('type' in data)) {
          return;
        }
        if (data.type === 'CLOSE') {
          document.body.removeChild(iframe); //РџРѕ РєРЅРѕРїРєРµ Р·Р°РєСЂС‹С‚РёСЏ СѓРґР°Р»СЏРµРј Р°Р№С„СЂРµР№Рј РёР· DOM-РґРµСЂРµРІР°
          document.body.getAttribute('style');
          document.body.removeAttribute('style'); //Рё СЂР°Р·Р±Р»РѕРєРёСЂРѕРІС‹РІР°РµРј РёСЃС…РѕРґРЅСѓСЋ СЃС‚СЂР°РЅРёС†Сѓ
          window.removeEventListener('message', closeModal);
        }
      }
    };
