# Mini Asset Manager

## 개요
Mini Asset Manager는 마크다운 콘텐츠와 관련된 파일을 관리하고 다운로드할 수 있는 컴포넌트입니다. 사용자는 마크다운 파일, 해당 HTML 미리보기, 업로드된 이미지 등을 구조화된 zip 형식으로 다운로드할 수 있습니다.

## 기능
- 이미지를 업로드하여 다양한 해상도로 변환할 수 있습니다.
  - 지원 해상도: 320px, 640px, 960px, 1280px
- 마크다운 이미지 링크를 자동으로 생성할 수 있습니다.
- 업로드된 이미지와 마크다운 콘텐츠를 zip 파일로 다운로드할 수 있습니다.
- 다운로드된 zip 파일에는 마크다운, HTML 파일 및 업로드된 이미지가 포함됩니다.
  - 미리보기 스타일링을 위한 CSS 파일이 zip 파일에 포함됩니다.

## 설정법

1. Mini Asset Manager 컴포넌트를 프로젝트에 포함시킵니다.
2. Mini Asset Manager를 루트 요소에 마운트합니다.
3. 제공된 메서드를 사용하여 마크다운 텍스트와 HTML 텍스트를 설정합니다.

다음은 설정 예시입니다:
```javascript
import MiniAssetManager from "./mini-asset-manager.js";
const mam = new MiniAssetManager();
mam.mount(document.getElementById("asset-manager-root"));
mam.setTextMarkdown(markdownText);
mam.setTextHtml(htmlText);
```

업로드한 이미지를 사용하여 작성한 마크다운을 렌더링 한 후 이미지를 링크하기 위해서 `resolveImageSources` 메서드를 호출하여 업로드된 이미지의 URL로 마크다운 이미지 링크를 대체할 수 있습니다. 다음과 같이 함수를 호출하면 container 요소 내의 이미지 태그 `<img>`가 업로드된 이미지의 URL로 대체됩니다:
```javascript
mam.resolveImageSources(container);
```

해당 메서드는 마크다운 콘텐츠 내의 이미지 링크를 업로드된 이미지의 URL로 대체하여 렌더링된 HTML에서 이미지를 올바르게 표시할 수 있도록 합니다.

해상도 버튼을 클릭하여 복사한 마크다운 이미지 링크는 다운로드 시 zip 파일 내에서 마크다운 파일 기준 상대경로로 생성됩니다. 예를 들어, 업로드된 이미지가 `assets/uploads/images/` 폴더에 저장되고 마크다운 파일이 zip 파일의 루트에 위치한다면, 마크다운 이미지 링크는 다음과 같이 생성됩니다:
```markdown
![alt text](assets/uploads/images/filename-640.jpg)
```
그러나 업로드된 이미지는 다운로드 전까지 다른 경로로 관리되므로 마크다운 렌더링 후 이미지 링크를 대체하기 위해 `resolveImageSources` 메서드를 사용하여 렌더링된 HTML 내의 이미지 태그 `<img>`의 `src` 속성을 업로드된 이미지의 URL로 대체하는 방식으로 이미지를 표시합니다.

## 사용법
- 업로드 버튼을 사용하여 이미지를 업로드합니다.
- 업로드된 이미지는 다양한 해상도로 변환되어 저장됩니다.
- 해상도 버튼을 클릭하여 해당 해상도의 이미지를 마크다운 이미지 링크로 복사할 수 있습니다.
- 다운로드 버튼을 클릭하여 마크다운 파일, HTML 미리보기, 업로드된 이미지가 포함된 zip 파일을 다운로드합니다.
- 다운로드된 zip 파일을 압축 해제하여 마크다운 콘텐츠와 관련된 모든 파일을 확인할 수 있습니다.
