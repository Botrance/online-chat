export type friendType = any;
export type roomType = { roomId: string; roomName: string; roomType: string };
export type msgType = {
  id: string;
  sender: string;
  message: string;
  time_CN: string;
};
export type markMsgType = { roomId: string; updateTime: number };
export type resType = {
  code: number;
  msg: string;
  [propName: string]: any;
};
export type tabType = {
  id: string;
  label: string;
};
export interface SoftTabProps {
  tabs: tabType[];
  defaultTab: string;
  OnClick: (id: string) => void;
}