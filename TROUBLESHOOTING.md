# 배포 문제 해결 가이드

## 404 에러가 발생하는 경우

### 1단계: Vercel 대시보드 확인

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트를 선택
3. "Deployments" 탭에서 최신 배포 상태 확인:
   - ✅ "Ready" 상태인지 확인
   - ❌ "Error" 또는 "Failed" 상태라면 로그 확인

### 2단계: 배포 로그 확인

배포가 실패했다면:
1. 실패한 배포를 클릭
2. "Build Logs" 확인
3. 에러 메시지 확인

**일반적인 에러:**
- `Build Command failed`: 빌드 명령어 확인
- `Module not found`: 의존성 설치 문제
- `Type error`: TypeScript 오류

### 3단계: 프로젝트 설정 확인

Vercel 프로젝트 설정에서:
1. "Settings" → "General" 확인
2. 다음 설정이 올바른지 확인:
   - **Framework Preset**: Vite (또는 Other)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (기본값)

### 4단계: GitHub 연결 확인

1. "Settings" → "Git" 확인
2. GitHub 저장소가 연결되어 있는지 확인
3. 브랜치가 `main` 또는 `master`인지 확인

### 5단계: 수동 재배포

1. Vercel 대시보드에서 프로젝트 선택
2. "Deployments" 탭
3. 최신 배포 옆 "..." 메뉴 클릭
4. "Redeploy" 선택

또는 GitHub에 새 커밋 푸시:
```bash
git add .
git commit -m "Fix deployment"
git push
```

## 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드가 성공하는지 확인:

```bash
# 빌드
npm run build

# 빌드 결과 확인
npm run preview
```

`http://localhost:4173`에서 정상 작동하는지 확인하세요.

## Vercel CLI를 사용한 배포

터미널에서 직접 배포할 수도 있습니다:

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 여전히 문제가 있다면

1. **빌드 로그 확인**: Vercel 대시보드에서 상세한 에러 메시지 확인
2. **로컬 빌드 테스트**: `npm run build`가 로컬에서 성공하는지 확인
3. **의존성 확인**: `package.json`의 모든 패키지가 올바른지 확인
4. **환경 변수**: 필요한 환경 변수가 설정되어 있는지 확인 (현재는 없음)

