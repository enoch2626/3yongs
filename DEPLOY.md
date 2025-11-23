# 배포 가이드

이 웹사이트를 공개하는 방법은 여러 가지가 있습니다. 가장 간단한 방법은 **Vercel**을 사용하는 것입니다.

## 방법 1: Vercel을 사용한 배포 (추천)

### 1단계: GitHub에 코드 업로드

1. GitHub에 새 저장소를 만듭니다
2. 다음 명령어를 실행합니다:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/3yongs.git
git push -u origin main
```

### 2단계: Vercel에 배포

1. [Vercel](https://vercel.com)에 가입/로그인합니다
2. "New Project"를 클릭합니다
3. GitHub 저장소를 선택합니다
4. 프로젝트 설정:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. "Deploy"를 클릭합니다

배포가 완료되면 자동으로 URL이 생성됩니다 (예: `https://3yongs.vercel.app`)

## 방법 2: Netlify를 사용한 배포

1. [Netlify](https://www.netlify.com)에 가입/로그인합니다
2. "Add new site" → "Import an existing project"를 선택합니다
3. GitHub 저장소를 연결합니다
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. "Deploy site"를 클릭합니다

## 방법 3: GitHub Pages를 사용한 배포

1. `package.json`에 다음 스크립트를 추가합니다:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

2. `gh-pages` 패키지를 설치합니다:

```bash
npm install --save-dev gh-pages
```

3. `vite.config.ts`에 base 경로를 추가합니다:

```typescript
export default defineConfig({
  base: '/3yongs/', // 저장소 이름
  plugins: [react()],
})
```

4. 배포합니다:

```bash
npm run deploy
```

## 로컬에서 빌드 확인

배포 전에 로컬에서 빌드된 파일을 확인할 수 있습니다:

```bash
npm run build
npm run preview
```

브라우저에서 `http://localhost:4173`으로 접속하여 확인할 수 있습니다.

## 주의사항

- 이 앱은 LocalStorage를 사용하므로 데이터는 브라우저에 저장됩니다
- 다른 기기에서 접속하면 데이터가 공유되지 않습니다
- 데이터를 클라우드에 저장하려면 백엔드 서버가 필요합니다

