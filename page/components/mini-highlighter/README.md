# Mini Highlighter

## 개요
Mini Highlighter는 마크다운 콘텐츠 내의 코드 블록을 구문 강조하여 렌더링하는 컴포넌트입니다. 사용자는 다양한 프로그래밍 언어에 대한 구문 강조를 지원하며, 코드 블록을 시각적으로 구분하여 가독성을 향상시킬 수 있습니다.

## 기능
- 다양한 프로그래밍 언어에 대한 구문 강조 지원 (현재는 C++ 언어 지원)
- 코드 블록의 시각적 구분을 위한 스타일링
- 간편한 설치 및 사용법

## 설정법
1. Mini Highlighter 컴포넌트를 프로젝트에 포함시킵니다.
2. Mini Highlighter를 루트 요소에 마운트합니다.
3. `highlight` 메서드를 호출하여 코드 블록을 구문 강조합니다.

다음은 설정 예시입니다:
```javascript
import MiniHighlighter from "./mini-highlighter.js";
const mhl = new MiniHighlighter();
mhl.mount(document.getElementById("highlighter-root"));
mhl.highlight();
```

## 사용법
- 마크다운 콘텐츠 내에 코드 블록을 작성합니다. 예를 들어, C++ 코드를 작성할 때는 다음과 같이 작성합니다:

``````markdown
```cpp
#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
``````

- `highlight` 메서드를 호출하여 코드 블록이 구문 강조된 상태로 렌더링됩니다.
- 지원되는 언어에 대한 코드 블록을 작성하여 다양한 프로그래밍 언어의 구문 강조를 활용할 수 있습니다. 현재는 C++ 언어에 대한 구문 강조가 지원되며, 향후 다른 언어에 대한 지원도 추가될 예정입니다.