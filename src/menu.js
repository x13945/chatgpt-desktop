const { app, Menu, shell, BrowserWindow } = require('electron');

class MenuBuilder {

  constructor(windowManager) {
    this.windowManager = windowManager;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }
    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return menu;
  }

  setupDevelopmentEnvironment() {
    mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            let window = BrowserWindow.getFocusedWindow()
            window && window.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: mainWindow });
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Configuration',
          accelerator: 'Command+,',
          click: () => {
            // console.log('config window: ', this.windowManager.configWindow);
            if (!this.windowManager.configWindow) {
              this.windowManager.createConfigWindow();
            } else {
              this.windowManager.configWindow.focus();
            }
          }
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };

    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };

    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            let window = BrowserWindow.getFocusedWindow()
            window && window.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            let window = BrowserWindow.getFocusedWindow()
            window && window.setFullScreen(!window.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            let window = BrowserWindow.getFocusedWindow()
            window && window.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            let window = BrowserWindow.getFocusedWindow()
            window && window.setFullScreen(!window.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme'
            );
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };
    const subMenuView =
      process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;
    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: 'Configuration',
            accelerator: 'Ctrl+,',
            click: () => {
              if (!this.windowManager.configWindow) {
                this.windowManager.createConfigWindow();
              } else {
                this.windowManager.configWindow.focus();
              }
            }
          },
          { type: 'separator' },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              let window = BrowserWindow.getFocusedWindow()
              window && window.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
            ? [
              {
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                  let window = BrowserWindow.getFocusedWindow()
                  window && window.webContents.reload();
                },
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  let window = BrowserWindow.getFocusedWindow()
                  window && window.setFullScreen(
                    !window.isFullScreen()
                  );
                },
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  let window = BrowserWindow.getFocusedWindow()
                  window && window.webContents.toggleDevTools();
                },
              },
            ]
            : [
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  let window = BrowserWindow.getFocusedWindow()
                  window && window.setFullScreen(
                    !window.isFullScreen()
                  );
                },
              },
            ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/electron/electron/tree/main/docs#readme'
              );
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];
    return templateDefault;
  }
}

module.exports = MenuBuilder