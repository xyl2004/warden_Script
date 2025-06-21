/**
 * 这是一个三步自动化脚本（最终版）
 * 作用：
 * 1. 自动提问 "what is web3" 并发送。
 * 2. 等待 15 秒后 (已更新)，自动发起兑换请求 "swap 0.01 sol to usdc" 并发送。
 * 3. 再等待 10 秒后，自动确认 "yes" 并发送。
 *
 * 使用了精确的选择器，成功率高。
 */
async function fillAndSendMessage(text) {
  // --- 步骤 1: 寻找聊天输入框 ---
  const inputSelectors = [
    'textarea[placeholder="Ask me anything..."]',
    'textarea',
    'input[type="text"]'
  ];
  let chatInput = document.querySelector(inputSelectors.join(', '));

  if (!chatInput) {
    console.error("错误：没能找到聊天输入框。脚本无法继续。");
    return false;
  }
  console.log("成功找到聊天输入框。");

  // --- 步骤 2: 填入文本 ---
  const nativeValueSetter = Object.getOwnPropertyDescriptor(chatInput.constructor.prototype, 'value').set;
  nativeValueSetter.call(chatInput, text);
  const inputEvent = new Event('input', { bubbles: true });
  chatInput.dispatchEvent(inputEvent);
  console.log(`成功将文本 "${text}" 填入输入框。`);

  // 等待一小会儿，让页面反应过来
  await new Promise(resolve => setTimeout(resolve, 200));

  // --- 步骤 3: 寻找并点击发送按钮 ---
  const sendButtonSelectors = [
    'button[form="chat-form-desktop"]:not([disabled])', // 首选：精确、可点击的按钮
    'button[type="submit"]:not([disabled])',           // 备选
    'button:has(svg[d^="M128,24"]):not([disabled])',    // 备选：通过图标
    'textarea ~ button:not([disabled])'                // 最后的备用方案
  ];

  let sendButton = null;
  for (const selector of sendButtonSelectors) {
    sendButton = document.querySelector(selector);
    if (sendButton) {
      console.log(`找到了可点击的发送按钮！使用的选择器是: "${selector}"`);
      break;
    }
  }

  if (!sendButton) {
    console.error("错误：没能找到可点击的发送按钮。脚本无法继续。");
    return false;
  }

  // --- 步骤 4: 点击发送 ---
  sendButton.click();
  console.log("已点击发送按钮！");
  return true;
}

/**
 * 主流程函数（已更新等待时间）
 */
async function main() {
  console.log("自动化脚本开始执行...");

  // --- 第一步: 发送 "what is web3" ---
  console.log("--- 正在发送第一条消息 ('what is web3') ---");
  if (!(await fillAndSendMessage("what is web3"))) {
    console.error("第一条消息发送失败，脚本终止。");
    return;
  }

  // --- 等待机器人响应 (已更新) ---
  console.log("第一条消息已发送。等待 15 秒让机器人响应...");
  await new Promise(resolve => setTimeout(resolve, 15000)); // 这里已从 5000 改为 15000
  console.log("等待结束！");

  // --- 第二步: 发送 "swap 0.01 sol to usdc" ---
  console.log("--- 正在发送第二条消息 ('swap...') ---");
  if (!(await fillAndSendMessage("swap 0.01 sol to usdc"))) {
    console.error("第二条消息发送失败，脚本终止。");
    return;
  }
  
  // --- 等待兑换请求处理 ---
  console.log("第二条消息已发送。现在开始等待 10 秒以处理兑换请求...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("等待结束！");

  // --- 第三步: 发送 "yes" ---
  console.log("--- 正在发送第三条消息 ('yes') ---");
  if (await fillAndSendMessage("yes")) {
      console.log("脚本执行完毕！所有操作均已成功。");
  } else {
      console.error("第三条消息 'yes' 发送失败。");
  }
}

// --- 启动主流程 ---
main(); 