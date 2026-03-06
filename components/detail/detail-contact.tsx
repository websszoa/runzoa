import type { Marathon } from "@/lib/types";
import {
  AtSign,
  BellRing,
  Headset,
  Instagram,
  MessageCircle,
  School,
  BookOpen,
  Youtube,
} from "lucide-react";

type DetailContactProps = {
  marathon: Marathon;
};

export default function DetailContact({ marathon }: DetailContactProps) {
  const hasContactInfo =
    marathon.hosts?.phone ||
    marathon.hosts?.email ||
    marathon.event_site ||
    marathon.sns?.instagram ||
    marathon.sns?.kakao ||
    marathon.sns?.blog ||
    marathon.sns?.youtube;

  if (!hasContactInfo) {
    return null;
  }

  return (
    <div className="detail__block">
      <h3>
        <BellRing className="w-5 h-5 text-brand" /> 문의하기
      </h3>
      <div className="contacts">
        {marathon.hosts?.phone && (
          <a href={`tel:${marathon.hosts.phone.replace(/\s/g, "")}`}>
            <span>전화 : {marathon.hosts.phone}</span>
            <Headset />
          </a>
        )}
        {marathon.hosts?.email && (
          <a href={`mailto:${marathon.hosts.email}`}>
            <span>이메일 : {marathon.hosts.email}</span>
            <AtSign />
          </a>
        )}
        {marathon.event_site && (
          <a
            href={marathon.event_site}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>공식 홈페이지</span>
            <School />
          </a>
        )}
        {marathon.sns?.instagram && (
          <a
            href={marathon.sns.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>인스타그램</span>
            <Instagram />
          </a>
        )}
        {marathon.sns?.kakao && (
          <a
            href={marathon.sns.kakao}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>카카오톡 문의</span>
            <MessageCircle />
          </a>
        )}
        {marathon.sns?.blog && (
          <a href={marathon.sns.blog} target="_blank" rel="noopener noreferrer">
            <span>블로그</span>
            <BookOpen />
          </a>
        )}
        {marathon.sns?.youtube && (
          <a
            href={marathon.sns.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>유튜브</span>
            <Youtube />
          </a>
        )}
      </div>
    </div>
  );
}
