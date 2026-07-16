/**
 * Cloudinary 이미지 URL에 자동 최적화 옵션을 추가합니다.
 * - q_auto: 화질을 자동으로 최적 압축 (눈으로는 차이 없이 용량만 줄어듦)
 * - f_auto: 브라우저에 맞는 최적 포맷(WebP 등)으로 자동 변환
 * - w_옵션: 용도에 맞는 가로 크기로 자동 리사이징
 */
export const optimizeCloudinaryUrl = (url: string, width?: number): string => {
  if (!url || !url.includes('res.cloudinary.com')) return url; // Cloudinary 주소가 아니면 그대로 반환

  const uploadMarker = '/upload/';
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;

  const widthParam = width ? `w_${width},` : '';
  const transformation = `${widthParam}q_auto,f_auto`;

  return url.slice(0, idx + uploadMarker.length) + transformation + '/' + url.slice(idx + uploadMarker.length);
};