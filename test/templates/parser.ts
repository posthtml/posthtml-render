// @ts-nocheck
const tree = ['<!DOCTYPE html>', '\n', {
  tag: 'html',
  attrs: {
    xmlns: 'http://www.w3.org/1999/xhtml',
    lang: 'en-US',
  },
  content: ['\n', {
    tag: 'head',
    content: ['\n    ', {
      tag: 'meta',
      attrs: {
        charset: 'utf-8',
      },
    }, '\n    ', {
      tag: 'title',
      content: ['Html'],
    }, '\n    ', {
      tag: 'meta',
      attrs: {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=EmulateIE7, IE=9',
      },
    }, '\n    ', {
      tag: 'meta',
      attrs: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    }, '\n    ', {
      tag: 'meta',
      attrs: {
        name: 'description',
        content: 'Description',
      },
    }, '\n\n    ', {
      tag: 'meta',
      attrs: {
        property: 'og:url',
        content: 'http://github.com/posthtml',
      },
    }, '\n    ', {
      tag: 'meta',
      attrs: {
        property: 'og:type',
        content: 'website',
      },
    }, '\n    ', {
      tag: 'meta',
      attrs: {
        property: 'og:site_name',
        content: 'PostHTML',
      },
    }, '\n\n    ', {
      tag: 'link',
      attrs: {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'path/to/file.css',
      },
    }, '\n    ', {
      tag: 'script',
      attrs: {
        src: 'path/to/file.js',
        type: 'text/javascript',
        charset: 'utf-8',
      },
    }, '\n\n    ', {
      tag: 'script',
      content: ['\n        console.log(\'PostHTML!\');\n    '],
    }, '\n'],
  }, '\n', {
    tag: 'body',
    attrs: {
      onload: 'try{if(!google.j.b){document.f&&document.f.q.focus();document.gbqf&&document.gbqf.q.focus();}}catch(e){}if(document.images)new Image().src=\'/images/nav_logo231.png\'',
    },
    content: ['\n\n    ', {
      tag: 'h1',
      content: ['Title'],
    }, '\n    ', {
      tag: 'p',
      content: ['Lorem ipsum dolor sit amet...'],
    }, '\n\n    ', {
      tag: 'section',
      attrs: {
        class: 'foo',
        style: 'color: red;',
      },
      content: ['\n        ', {
        tag: 'header',
        attrs: {
          class: 'foo bar',
          style: 'color: blue; border: 1px solid',
          id: 'id',
        },
        content: ['\n            ', {
          tag: 'div',
          attrs: {
            class: 'foo bar baz',
            id: 'idd',
            'data-url': 'url/to/',
          },
          content: ['\n                ', {
            tag: 'span',
            attrs: {
              id: 'idd',
              'data-data': '{ foo: \'bar\' }',
            },
            content: ['\n                    ', {
              tag: 'a',
              attrs: {
                href: '#',
              },
              content: ['\n                        ', {
                tag: 'img',
                attrs: {
                  src: 'path/to/img',
                },
              }, '\n                        Link\n                    '],
            }, '\n                '],
          }, '\n            '],
        }, '\n        '],
      }, '\n    '],
    }, '\n\n    ', {
      content: {
        tag: 'hr',
      },
    }, '\n\n    ', {
      tag: 'script',
      attrs: {
        type: 'text/javascript',
      },
      content: [
        '\n        (function(){function k(a){++b;a=a||window.event;google.iTick(a.target||a.srcElement)}if(google.timers&&google.timers.load.t){var c,b,f;google.c.c.a&&(google.startTick("aft"),google.afte=!1);var g=document.getElementsByTagName("img");c=g.length;for(var d=b=0,a;d',
        '<c;++d)if(a=g[d],google.c.c.i&&"none"==a.style.display)++b;else{var h="string"!=typeof a.src||!a.src,e=h||a.complete;google.c.c.d?a.getAttribute("data-deferred")&&(e=!1,a.removeAttribute("data-deferred")):google.c.c.m&&h&&a.getAttribute("data-bsrc")&&\n        (e=!1);e?++b:google.rll(a,!0,k)}f=c-b;google.rll(window,!1,function(){google.tick("load","ol");google.c.e("load","imc",String(b));google.c.e("load","imn",String(c));google.c.e("load","imp",String(f));google.unblockCSI("load","ol")});google.tick("load",["prt","iml"])}})();\n    ',
      ],
    }, '\n\n    ', {
      tag: 'script',
      attrs: {
        src: 'path/to/file2.js',
        type: 'text/javascript',
        charset: 'utf-8',
      },
    }, '\n'],
  }, '\n'],
}, '\n', {
  tag: false,
  content: [Number.NaN],
}, {
  tag: false,
  content: [[]],
}, {
  tag: false,
  content: [''],
}, {
  tag: false,
  content: [null],
}, {
  tag: false,
  content: [false],
}, {
  tag: false,
  content: [undefined],
}, {
  tag: false,
  content: Number.NaN,
}, {
  tag: false,
  content: [],
}, {
  tag: false,
  content: '',
}, {
  tag: false,
  content: null,
}, {
  tag: false,
  content: false,
}, {
  tag: false,
  content: undefined,
}, Number.NaN, [], '', null, false, undefined];

export default tree;
