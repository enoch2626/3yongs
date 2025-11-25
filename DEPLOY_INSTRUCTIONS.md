# 실서버 배포 가이드

## 🚀 빠른 배포 방법

### 옵션 1: Vercel CLI로 배포 (가장 빠름)

```bash
# 1. Vercel 로그인
npx vercel login

# 2. 프로젝트 배포
npx vercel --prod
```

### 옵션 2: Vercel 웹사이트에서 배포 (권장)

1. **GitHub에 푸시** (변경사항 커밋 필요)
   ```bash
   git add .
   git commit -m "3yongs 성장 질문 앱 배포 준비"
   git push origin main
   ```

2. **Vercel 웹사이트 접속**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

3. **프로젝트 추가**
   - "Add New Project" 클릭
   - GitHub 저장소 선택 (3yongs)
   - 프로젝트 설정:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - "Deploy" 클릭

4. **배포 완료**
   - 배포가 완료되면 자동으로 URL이 생성됩니다
   - 예: `https://3yongs-xxx.vercel.app`

### 옵션 3: Netlify 배포

1. https://netlify.com 접속
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy 클릭

## ✅ 배포 전 확인사항

- [x] 빌드 성공 확인 (`npm run build`)
- [x] `vercel.json` 설정 확인
- [ ] GitHub에 최신 코드 푸시
- [ ] 환경 변수 확인 (현재는 필요 없음)

## 📝 배포 후 확인

배포 후 다음을 확인하세요:
- 메인 페이지 로드 확인
- 질문 생성 기능 확인
- 답변 저장 기능 확인
- 날짜별 질문 변경 확인

## 🔧 문제 해결

### 빌드 오류 발생 시
```bash
# 타입 체크 없이 빌드
npm run build -- --mode production
```

### 배포 후 404 오류 발생 시
- `vercel.json`의 rewrites 설정 확인
- SPA 라우팅 설정 확인

