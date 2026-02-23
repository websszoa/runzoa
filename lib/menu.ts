import { LucideIcon } from "lucide-react";
import {
  Home,
  Newspaper,
  Rat,
  Compass,
  Drama,
  Cable,
  Gamepad2,
  Helicopter,
  User,
  Star,
  ClipboardPen,
  Hamburger,
  Projector,
  Gem,
  Component,
} from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

// 기본 메뉴
export const basicMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "공지사항", href: "/notice" },
  { icon: Rat, label: "문의하기", href: "/contact" },
  { icon: Compass, label: "이용약관", href: "/terms" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy" },
];

// 로그인 안 했을 때
export const guestMenuItems: MenuItem[] = [
  { icon: User, label: "내 정보", href: "/profile" },
  { icon: Star, label: "즐겨찾기", href: "/favorites" },
  { icon: ClipboardPen, label: "기록하기", href: "/records" },
];

// 로그인 했을 때
export const userMenuItems: MenuItem[] = [
  { icon: User, label: "내 정보", href: "/profile" },
  { icon: Star, label: "즐겨찾기", href: "/favorites" },
  { icon: ClipboardPen, label: "기록하기", href: "/records" },
  { icon: Gem, label: "관리자", href: "/admin" },
];

// 푸터 메뉴
export const footerMenuItems: MenuItem[] = [
  { icon: Projector, label: "소개", href: "/intro" },
  { icon: Hamburger, label: "문의사항", href: "/contact" },
];

// 모바일 메뉴
export const mobileMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "공지사항", href: "/notice" },
  { icon: Rat, label: "문의하기", href: "/contact" },
  { icon: Component, label: "더보기", href: "#more" },
];

// 관리자 메뉴
export const adminMenuItems: MenuItem[] = [
  { icon: Home, label: "대시보드", href: "/admin" },
  { icon: Gamepad2, label: "문의사항", href: "/admin/contact" },
  { icon: Cable, label: "회원", href: "/admin/member" },
  { icon: Helicopter, label: "마라톤", href: "/admin/marathon" },
];
