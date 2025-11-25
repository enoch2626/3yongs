# 배포 가이드

## Vercel에 배포하기

### 방법 1: Vercel CLI 사용 (권장)

```bash
# Vercel CLI 설치 (전역)
npm i -g vercel

# 또는 npx 사용
npx vercel

# 배포
vercel --prod
```

### 방법 2: Vercel 웹사이트 사용

1. https://vercel.com 에서 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 설정:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. "Deploy" 클릭

### 방법 3: GitHub Actions 사용

`.github/workflows/deploy.yml` 파일을 생성하여 자동 배포 설정 가능

## 빌드 확인

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 환경 변수

현재는 환경 변수가 필요하지 않습니다. (모든 데이터는 LocalStorage에 저장)
