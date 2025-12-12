import { toast } from 'sonner';

/**
 * Mutation 에러 핸들러
 * @param error - 발생한 에러
 * @param action - 수행하려던 작업 (예: "게시물 생성", "댓글 삭제")
 */
export const handleMutationError = (error: Error, action: string) => {
  console.error(`${action} 실패:`, error);

  // Toast 알림으로 사용자에게 에러 표시
  toast.error(`${action} 실패`, {
    description: '다시 시도해주세요.',
  });

  // 개발 환경에서 상세 에러 로그
  if (import.meta.env.DEV) {
    console.error('Error details:', error);
  }
};

/**
 * Query 에러 핸들러
 * @param error - 발생한 에러
 * @param resource - 리소스 이름 (예: "게시물", "댓글")
 */
export const handleQueryError = (error: Error, resource: string) => {
  console.error(`${resource} 조회 실패:`, error);

  // Toast 알림으로 사용자에게 에러 표시
  toast.error(`${resource} 로딩 실패`, {
    description: '페이지를 새로고침해주세요.',
  });
};

/**
 * 성공 알림
 * @param action - 성공한 작업 (예: "게시물 생성", "댓글 삭제")
 */
export const handleMutationSuccess = (action: string) => {
  toast.success(`${action} 완료`, {
    description: '작업이 성공적으로 완료되었습니다.',
  });
};

/**
 * 네트워크 에러인지 확인
 */
export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message === 'Failed to fetch';
};

/**
 * 에러 메시지 추출
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '알 수 없는 오류가 발생했습니다.';
};
