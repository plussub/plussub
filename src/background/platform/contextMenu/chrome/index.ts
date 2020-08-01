import { v4 as uuid } from 'uuid';

export const createContextMenu = () => {
  chrome.contextMenus.create({
    id: '9a37507b-aa16-4a45-ab6a-00642d2cd34f',
    title: '+sub',
    // type: 'normal',
    contexts: ['page', 'video']
  });
  chrome.contextMenus.create({
    id: 'fba4eab4-c420-4ad0-9218-f972bbfdd83c',
    title: 'Add sub to',
    type: 'normal',
    parentId: '9a37507b-aa16-4a45-ab6a-00642d2cd34f'
  });

  chrome.contextMenus.create({
    id: uuid(),
    title: 'Video: abc',
    type: 'normal',
    parentId: 'fba4eab4-c420-4ad0-9218-f972bbfdd83c'
  });

  chrome.contextMenus.create({
    id: uuid(),
    title: 'Video: xyz',
    type: 'normal',
    parentId: 'fba4eab4-c420-4ad0-9218-f972bbfdd83c'
  });

  chrome.contextMenus.onClicked.addListener(() => {
    chrome.tabs.executeScript({
      code: 'document.body.style.backgroundColor="red"'
    });
  });
};
