// API Base URL 설정
// DummyJSON API를 직접 호출 (CORS 허용 여부 테스트)
export const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://dummyjson.com';
