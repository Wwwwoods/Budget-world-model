/**
 * 丐版世界模型 (Budget World Model) - Google Apps Script 后端桥接 (Code.gs)
 * 部署前请将 WORLD_FILE_ID 替换为你的 Google 云盘世界 JSON 文件 ID
 */
const WORLD_FILE_ID = "<YOUR_WORLD_FILE_ID>";
const LOG_EMAIL_PREFIX = "[RPG-LOG]";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("丐版世界模型 · Budget World Model")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
}

function loadWorldFromDrive() {
  try {
    const file = DriveApp.getFileById(WORLD_FILE_ID);
    const data = JSON.parse(file.getBlob().getDataAsString("UTF-8"));
    return { ok: true, data: data, lastUpdated: file.getLastUpdated().toISOString() };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function savePlayerStateToDrive(patch) {
  try {
    const file = DriveApp.getFileById(WORLD_FILE_ID);
    const world = JSON.parse(file.getBlob().getDataAsString("UTF-8"));
    if (patch) {
      if (typeof patch.globalTime === "number") world.globalTime = patch.globalTime;
      if (patch.player) world.player = Object.assign({}, world.player, patch.player);
      if (Array.isArray(patch.behaviorLog)) world.behaviorLog = patch.behaviorLog;
      if (Array.isArray(patch.executedActionIds)) world.executedActionIds = patch.executedActionIds;
      if (Array.isArray(patch.affairs)) world.affairs = patch.affairs;
    }
    world.lastUpdated = new Date().toISOString();
    file.setContent(JSON.stringify(world, null, 2));
    return { ok: true, p0Revision: world.p0Revision || 1, p2Revision: world.p2Revision || 1 };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function dispatchGameLog(request) {
  try {
    if (request && request.statePatch) savePlayerStateToDrive(request.statePatch);
    const email = Session.getActiveUser().getEmail();
    if (!email) return { ok: false, error: "无法获取账号邮箱，请确认部署时选择“以我自己的身份执行”。" };
    const triggerType = (request && request.triggerType) ? String(request.triggerType) : "manual_p0";
    const shortTitle = (request && request.shortTitle) ? request.shortTitle : "游戏新 Log 同步";
    const subject = LOG_EMAIL_PREFIX + " " + shortTitle;
    const body = [
      "【丐版世界模型 · 游戏新 Log 同步】",
      "- 触发方式: " + triggerType,
      "- 云盘世界 JSON ID: " + WORLD_FILE_ID,
      "- 摘要: " + shortTitle,
      "",
      (request && request.payloadText) ? request.payloadText : "",
      "",
      "（Master GM 顺序：① 优先极速交付 P0 并递增 p0Revision 立刻存盘；② 异步并行派发 P1 预热与 P2 演进子代理；③ 安全合并补丁写回云盘并递增 p2Revision。切勿回复带 [RPG-LOG] 的邮件。）"
    ].join("\n"\);
    GmailApp.sendEmail(email, subject, body);
    return { ok: true, triggerType: triggerType, subject: subject };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function dispatchPriorityTask(request) {
  return dispatchGameLog({
    triggerType: (request && request.priority === "P0") ? "manual_p0" : "event",
    shortTitle: request && request.shortTitle,
    payloadText: request && request.payloadText,
    statePatch: request && request.statePatch
  });
}

function cleanupRpgTaskEmails(minAgeMinutes) {
  try {
    const mins = typeof minAgeMinutes === "number" ? minAgeMinutes : 3;
    const cutoff = Date.now() - mins * 60 * 1000;
    const query = 'subject:("[RPG-LOG]" OR "[RPG-P0]" OR "[RPG-P1]" OR "[RPG-P2]" OR "[RPG-BG]") -in:trash';
    const threads = GmailApp.search(query, 0, 40);
    let cleaned = 0;
    threads.forEach(function (thread) {
      const lastDate = thread.getLastMessageDate();
      if (lastDate && lastDate.getTime() <= cutoff) {
        thread.moveToTrash();
        cleaned += 1;
      }
    });
    return { ok: true, cleaned: cleaned };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
