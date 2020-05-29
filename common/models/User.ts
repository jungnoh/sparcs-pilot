/**
 * @description 사용자 모델 중 공개되어도 괜찮은 정보
 */
export interface UserProfile {
  // 사용자명
  username: string;
  // 기숙사 (또는 거주위치)
  dorm: string;
  // 이메일
  email: string;
  // 이름
  name: string;
  // 전화번호
  phone: string;
}

/**
 * @description 사용자 모델
 */
export interface User extends UserProfile {
  // 비밀번호
  password: string;
  // 생성일자
  createdAt: Date;
}
