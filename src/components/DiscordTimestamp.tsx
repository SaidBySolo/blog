import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';

/**
 * 디스코드 타임스탬프 포맷 코드
 * t - 짧은 시간       예) 오후 9:01
 * T - 긴 시간         예) 오후 9:01:00
 * d - 짧은 날짜       예) 2025. 3. 4.
 * D - 긴 날짜         예) 2025년 3월 4일
 * f - 짧은 날짜+시간  예) 2025년 3월 4일 오후 9:01  (기본값)
 * F - 긴 날짜+시간    예) 2025년 3월 4일 화요일 오후 9:01
 * R - 상대 시간       예) 3일 전, 2시간 후 (1초마다 갱신)
 */
export type DiscordTimestampFormat = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';

interface Props {
  /** Unix 타임스탬프 (초 단위) */
  unix: number;
  /** 디스코드 포맷 코드 (기본값: 'f') */
  format?: DiscordTimestampFormat;
  /** 로케일 (기본값: 'ko-KR') */
  locale?: string;
}

const LOCALE_DEFAULT = 'ko-KR';

function formatTimestamp(unix: number, format: DiscordTimestampFormat, locale: string): string {
  const date = new Date(unix * 1000);
  switch (format) {
    case 't':
      return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    case 'T':
      return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    case 'd':
      return date.toLocaleDateString(locale);
    case 'D':
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    case 'f':
      return date.toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    case 'F':
      return date.toLocaleString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    case 'R':
      return getRelativeTime(unix, locale);
  }
}

function getRelativeTime(unix: number, locale: string): string {
  const diffSec = unix - Date.now() / 1000;
  const absSec = Math.abs(diffSec);
  const sign = diffSec < 0 ? -1 : 1;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (absSec < 60)       return rtf.format(sign * Math.round(absSec), 'second');
  if (absSec < 3600)     return rtf.format(sign * Math.round(absSec / 60), 'minute');
  if (absSec < 86400)    return rtf.format(sign * Math.round(absSec / 3600), 'hour');
  if (absSec < 2592000)  return rtf.format(sign * Math.round(absSec / 86400), 'day');
  if (absSec < 31536000) return rtf.format(sign * Math.round(absSec / 2592000), 'month');
  return rtf.format(sign * Math.round(absSec / 31536000), 'year');
}

export const DiscordTimestamp = component$<Props>(({ unix, format = 'f', locale = LOCALE_DEFAULT }) => {
  const display = useSignal(formatTimestamp(unix, format, locale));
  const fullDate = formatTimestamp(unix, 'F', locale);

  // 'R' 포맷일 때만 1초마다 갱신
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (format !== 'R') return;
    const id = setInterval(() => {
      display.value = getRelativeTime(unix, locale);
    }, 1000);
    cleanup(() => clearInterval(id));
  });

  return (
    <time
      dateTime={new Date(unix * 1000).toISOString()}
      title={fullDate}
      class="inline-flex items-center gap-1 rounded bg-base-content/10 px-1.5 py-0.5 font-mono text-sm cursor-default"
    >
      {display.value}
    </time>
  );
});

export default DiscordTimestamp;
