# 서울대 AI CEO 주소록

AI CEO 동문을 한눈에, 한 번에

## 개요

서울대 AI CEO 과정(기수별) 대표님들의 연락처와 회사 정보를 안전하게 등록, 수정, 열람할 수 있는 전용 주소록 웹 애플리케이션입니다.

## 주요 기능

### 일반 사용자(동문)
- 기수별 주소록 조회
- 통합 검색 (이름, 소속, 직책, 이메일, 전화번호, 주소)
- 필터 및 정렬 기능
- 프로필 상세 보기
- 본인 정보 수정 요청

### 관리자(운영팀)
- 참가자 정보 CRUD (생성, 조회, 수정, 삭제)
- 엑셀/CSV 일괄 업로드
- 엑셀 다운로드 (백업)
- 정보 수정 요청 승인/거부
- 기수 관리

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS
- **라우팅**: React Router
- **HTTP 클라이언트**: Axios
- **엑셀 처리**: xlsx
- **아이콘**: Lucide React

## 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정 (선택사항)

백엔드 API를 사용하는 경우 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_API=false
```

**기본적으로 모킹 API가 활성화되어 있어 백엔드 없이도 바로 사용할 수 있습니다.**

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## 프로젝트 구조

```
src/
  ├── components/          # React 컴포넌트
  │   ├── AddressBookList.tsx    # 주소록 리스트 및 검색
  │   ├── ParticipantDetail.tsx  # 프로필 상세 보기
  │   ├── ParticipantForm.tsx   # 참가자 등록/수정 폼
  │   ├── UpdateRequestForm.tsx  # 정보 수정 요청 폼
  │   ├── ExcelUpload.tsx        # 엑셀 업로드
  │   ├── AdminDashboard.tsx     # 관리자 대시보드
  │   ├── Login.tsx              # 로그인
  │   └── AuthGuard.tsx          # 인증 가드
  ├── types/              # TypeScript 타입 정의
  ├── utils/              # 유틸리티 함수
  │   ├── api.ts          # API 클라이언트
  │   └── excel.ts        # 엑셀 처리
  └── App.tsx             # 메인 앱 컴포넌트
```

## API 엔드포인트

백엔드 API는 다음 구조를 따릅니다:

- `POST /api/auth/login` - 로그인
- `GET /api/participants` - 참가자 목록 조회
- `GET /api/participants/:id` - 참가자 상세 조회
- `POST /api/participants` - 참가자 생성 (어드민)
- `PUT /api/participants/:id` - 참가자 수정 (어드민)
- `DELETE /api/participants/:id` - 참가자 삭제 (어드민)
- `POST /api/participants/upload` - 엑셀 업로드 (어드민)
- `GET /api/participants/export` - 엑셀 다운로드 (어드민)
- `POST /api/update-requests` - 수정 요청 생성
- `GET /api/update-requests` - 수정 요청 목록 (어드민)
- `PUT /api/update-requests/:id` - 수정 요청 처리 (어드민)
- `GET /api/cohorts` - 기수 목록

## 사용 방법

### 테스트 계정

모킹 모드에서는 다음 계정으로 로그인할 수 있습니다:

- **관리자**: `admin@snu.ac.kr` / `password`
- **동문**: `participant@example.com` / `password`

### 로그인
1. 이메일과 비밀번호로 로그인
2. 역할에 따라 다른 화면이 표시됩니다
3. 모킹 모드에서는 모든 데이터가 로컬 스토리지에 저장됩니다

### 주소록 조회
1. 메인 화면에서 기수를 선택하거나 전체 목록 확인
2. 검색창에 키워드 입력하여 검색
3. 테이블 헤더 클릭하여 정렬
4. 행 클릭하여 상세 정보 확인

### 정보 수정 요청 (동문)
1. 본인 프로필 상세 화면에서 "정보 수정 요청" 클릭
2. 수정할 필드 입력
3. 제출 후 관리자 승인 대기

### 관리자 기능
1. 관리자 페이지 접속 (`/admin`)
2. "새 참가자 추가" 또는 "엑셀 업로드"로 데이터 등록
3. "수정 요청" 탭에서 요청 승인/거부

## 보안

- 모든 API 요청은 JWT 토큰 기반 인증
- 역할 기반 접근 제어 (RBAC)
- HTTPS 통신 필수 (프로덕션)
- 개인정보 암호화 저장 (백엔드 구현 필요)

## 반응형 디자인

- 데스크톱: 테이블 뷰
- 모바일/태블릿: 카드 뷰로 자동 전환

## 라이선스

프로젝트 내부 사용 전용
