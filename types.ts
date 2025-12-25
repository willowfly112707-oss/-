
export enum DocType {
  NOTICE = '通知',
  REPORT = '报告',
  DECISION = '决定',
  REQUEST = '请示',
  RESOLUTION = '决议',
  LETTER = '函',
  MINUTES = '纪要',
  SPEECH = '讲话稿',
  SUMMARY = '总结',
  DEBRIEF = '述职报告',
  NEWS = '新闻稿'
}

export interface OfficialDocument {
  title: string;
  recipient?: string;
  body: string;
  sender: string;
  date: string;
  attachments?: string[];
}

export interface DocumentStyle {
  fontSize: number;
  lineHeight: number;
  titleWeight: string;
  bodyFont: string;
}
