module.exports = {
  "root": true,
  "env": {
    "node": true,
    "browser": true,
    "vitest/env": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    // "plugin:import/recommended",
    // "plugin:prettier/recommended",
    // "plugin:vitest/legacy-recommended",
    // "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "vue",
    "promise",
    "import",
    "vitest",
    "prettier",
    "eslint-plugin-local-rules",
  ],
  "ignorePatterns": [
    // "**/**.spec.ts",
    // "src/tests",
    "dist",
    "node_modules",
  ],
  "rules": {
    // local
    "local-rules/prefer-define-model": "error",
    "local-rules/emit-event-name": "error",
    // "semi": ["off", "always"],

    // prettier
    "prettier/prettier": "error",

    // sort
    "sort-imports": [
      "error",
      {
        "ignoreCase": false,
        "ignoreDeclarationSort": true,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": false,
      },
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "pathGroups": [
          {
            "pattern": "vue",
            "group": "builtin",
            "position": "before",
          },
          {
            "pattern": "vue-router",
            "group": "builtin",
            "position": "before",
          },
          {
            "pattern": "@vue**",
            "group": "builtin",
            "position": "before",
          },
          {
            "pattern": "@datadog",
            "group": "builtin",
            "position": "after",
          },
          {
            "pattern": "dayjs",
            "group": "external",
            "position": "before",
          },
          {
            "pattern": "lodash",
            "group": "external",
            "position": "before",
          },
          {
            "pattern": "axios",
            "group": "external",
            "position": "before",
          },
          {
            "pattern": "@/api/**",
            "group": "parent",
            "position": "before",
          },
          {
            "pattern": "@/store/**",
            "group": "parent",
            "position": "before",
          },
          {
            "pattern": "@/assets/**",
            "group": "parent",
            "position": "before",
          },
          {
            "pattern": "@/models/**",
            "group": "parent",
            "position": "before",
          },
          {
            "pattern": "@/components/**",
            "group": "parent",
            "position": "before",
          },
          {
            "pattern": "@/views/**",
            "group": "parent",
            "position": "before",
          },
          {
            "pattern": "pinch-zoom-js",
            "group": "type",
            "position": "after",
          },
          {
            "pattern": "swiper|swiper/**",
            "group": "type",
            "position": "after",
          },
          {
            "pattern": "vue-i18n",
            "group": "type",
            "position": "after",
          },
        ],
        // "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true,
        },
        "pathGroupsExcludedImportTypes": [],
      },
    ],

    // 240508 추가 off
    // default
    "prefer-const": "error", // const 사용 권장
    "no-undef": "error", // 선언하지 않은 변수 사용 불가
    "no-empty": "error", // 빈 블록문
    "no-var": "error", // var 사용 불가
    "no-param-reassign": "off", // 매개변수 재할당 금지; TODO 보류
    "no-case-declarations": "error", // case 문에서 선언 불가
    "no-useless-escape": "error", // 불필요한 이스케이프
    "no-useless-catch": "error", // 불필요한 catch
    "no-extra-boolean-cast": "error", // 불필요한 boolean 캐스팅
    "no-unsafe-optional-chaining": "error", // optional chaining 선택적 연결
    "no-async-promise-executor": "error", // promise 실행자의 async 사용 불가
    "no-prototype-builtins": "error", // Object.prototype의 내장 메서드 직접 호출금지
    "no-unreachable": "error", // 도달할 수 없는 코드
    "no-fallthrough": "error", // switch 문에서 break 누락
    "default-case": "off", // switch 문에서 default 필수; TODO 보류
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

    // ####### VUE #######
    // -- Naming
    "vue/multi-word-component-names": "off",            // @unused 컴포넌트 이름은 단일 단어여야 함.
    "vue/component-definition-name-casing": ["error", "PascalCase"],  // 컴포넌트 이름 케이스 pascal
    "vue/prop-name-casing": ["error", "camelCase"],     // prop 이름 케이스 camel
    "vue/attribute-hyphenation": ["error", "always"],   // 태그의 속성명은 kebab-case
    "vue/v-on-event-hyphenation": ["error", "always"],  // 태그의 이벤트 이름은 kebab-case
    // -- Promise, Async, Await
    "vue/no-async-in-computed-properties": "warn",      // computed 에서 async 사용 불가
    "vue/no-expose-after-await": "warn",      // expose 는 컴포넌트와 synchronized 해야 함.
    "vue/no-lifecycle-after-await": "warn",   // await 이후에는 lifecycle hook 사용 불가
    "vue/no-watch-after-await": "warn",       // await 이후에는 watch 사용 불가
    // -- Template
    // ---- Defined Directives
    "vue/no-child-content": "error",          // v-html, v-text 와 자식 컴포넌트 같이 사용 불가
    "vue/no-v-text-v-html-on-component": ["error", {    // component 에서 v-text, v-html 사용 불가
      "allow": ["router-link"],
    }],
    "vue/no-dupe-v-else-if": "error",         // v-if, v-else-if 간 중복 불허
    "vue/no-use-v-if-with-v-for": "error",    // v-if 와 v-for 는 같이 사용 불가
    "vue/require-v-for-key": "error",         // v-for 에 key 가 필수
    "vue/v-slot-style": ["error", {          // v-slot 줄임 표현
      "atComponent": "shorthand",
      "default": "shorthand",
      "named": "shorthand",
    }],
    "vue/v-bind-style": ["error", "shorthand", {       // v-bind 줄임 표현. shorthand
      "sameNameShorthand": "never",                     // <div :is-deleted /> => multi word 속성은 컴파일에 실패해서 never 로 설정
    }],
    "vue/v-on-style": "error",                          // v-on 줄임 표현. shorthand
    "vue/no-v-for-template-key-on-child": "error",      // v-for 자식 컴포넌트에 template key 사용 불가
    "vue/v-if-else-key": "off",                         // @unused v-if, v-else 에 key 무조건 사용
    // ---- Defined Component
    "vue/require-component-is": "error",                // <component> 에 is 속성 필수
    "vue/require-toggle-inside-transition": "error",    // <Transition> 안에서 분기가 존재해야 함
    "vue/no-template-key": "error",                     // <template> 에 :key 사용 불가
    "vue/no-useless-template-attributes": "error",      // <template> 에 불필요한 속성 사용 불가
    // ---- element
    "vue/no-textarea-mustache": "error",                // textarea 에서 mustache 사용 불가
    "vue/first-attribute-linebreak": ["error", {       // 첫 속성 줄바꿈
      "singleline": "beside",
      "multiline": "below",
    }],
    "vue/html-closing-bracket-newline": ["error", {    // 닫는 태그 줄바꿈. 줄바꿈 안함
      "singleline": "never",
      "multiline": "never",
    }],
    "vue/html-closing-bracket-spacing": ["error", {    // 닫는 태그 여백. self closing 만 띄어쓰기
      "startTag": "never",
      "endTag": "never",
      "selfClosingTag": "always",
    }],
    "vue/html-indent": ["error", 2, {        // html 들여쓰기. 2칸
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": [],
    }],
    "vue/html-quotes": ["error", "double"], // html 속성 따옴표. "쌍따옴표"
    "vue/html-self-closing": ["error", {     // html 닫는 태그. 무조건 self closing
      "html": {
        "void": "always",
        "normal": "always",
        "component": "always",
      },
      "svg": "always",
      "math": "always",
    }],
    "vue/max-attributes-per-line": ["error", {         // 한 줄에 속성 개수
      "singleline": 4,
      "multiline": 1,
    }],
    "vue/multiline-html-element-content-newline": "error",  // 여러 줄 태그 내용 줄바꿈
    "vue/mustache-interpolation-spacing": "error",      // {{ }} 내부 띄어쓰기
    "vue/no-useless-mustaches": "error",                // 불필요한 {{ }} 사용 불가. {{ 'ㅁㄴㅇㄹ' }} 이런 거.
    "vue/no-multi-spaces": "error",                     // 여러 공백 사용 불가
    "vue/no-spaces-around-equal-signs-in-attribute": "error",  // 속성 = 사이 공백
    "vue/attributes-order": "off",                      // @unused
    "vue/no-static-inline-styles": "off",               // @unused style 에 static 인라인 스타일 사용 불가
    "vue/no-template-target-blank": "off",              // @unused target="_blank" 은 rel="noopener noreferrer" 사용
    "vue/prefer-true-attribute-shorthand": "off",       // true 는 단축 속성 사용
    // @unused 안줄이는 게 나은듯..
    "vue/component-name-in-template-casing": ["error", "PascalCase"],   // 컴포넌트 이름 케이스
    "vue/singleline-html-element-content-newline": [    // @unused 한 줄 태그 내용 줄바꿈 굳이?
      "off",
      {
        "ignoreWhenNoAttributes": true,
        "ignoreWhenEmpty": true,
      },
    ],
    // ! 테스트 필요
    "vue/no-template-shadow": "error",        // template 변수 중복 사용 불가
    // -- Component
    "vue/no-export-in-script-setup": "off",   // @unused script setup 에서 export 사용 불가. vue 업데이트에 따라 적절치 않음
    "vue/no-arrow-functions-in-watch": "error",           // watch 에서 arrow function 사용 불가
    // ! 테스트 필요
    "vue/no-mutating-props": "warn",                      // props 를 직접 변경 불가. 
    // warn 리팩터링 필요..
    // ! 테스트 필요
    "vue/no-ref-as-operand": "error",                     // ref 를 연산에 사용 불가
    "vue/no-reserved-component-names": "error",           // 예약어 컴포넌트 이름 사용 불가
    "vue/no-reserved-keys": "error",                      // 예약어 함수, 변수 사용 불가
    "vue/no-reserved-props": "error",                     // 예약어 prop 사용 불가
    // ! 테스트 필요
    "vue/no-side-effects-in-computed-properties": "error",  // computed 에서 side effect 사용 불가
    "vue/no-unused-components": "error",                  // 사용하지 않는 컴포넌트
    "vue/no-unused-vars": ["error", {                     // 사용하지 않는 변수
      "ignorePattern": "^_",
    }],
    "vue/no-use-computed-property-like-method": "error",  // computed 를 method 처럼 사용 불가
    "vue/prefer-import-from-vue": "error",                // from @vue 대신 from "vue" 사용
    // ! 테스트 필요
    "vue/return-in-computed-property": "error",           // computed 는 무조건 return 해야 함.
    "vue/require-default-prop": "off",                    // @unused default prop 필수
    // ! 테스트 필요
    "vue/require-explicit-slots": "off",      // 정의한 slot 만 사용
    // @unused dynamic slot name 사용 불가
    "vue/require-macro-variable-name": ["error", {       // macro 변수 이름 통일 (props, emits, slots, attrs, ..)
      "defineProps": "props",
      "defineEmits": "emits", // default is "emit"
      "defineSlots": "slots",
      "useSlots": "slots",
      "useAttrs": "attrs",
    }],
    "vue/no-dupe-keys": "error",              // key 중복 불가
    "vue/no-parsing-error": "error",          // 파싱 에러
    "vue/no-v-html": "off",                   // @unused v-html 사용 불가
    // ---- valid
    "vue/valid-v-for": "error",
    "vue/valid-v-slot": "off",    // @unused #slotname.id="{rowData}" 이런 형식을 우선 없애야 함
    "vue/valid-v-on": "error",
    "vue/valid-define-props": "error",

    // === TS ===
    "@typescript-eslint/no-namespace": "error", // namespace 사용 불가
    "@typescript-eslint/ban-ts-comment": "off", // @ts- 를 사용하지 않음; TODO 보류
    "@typescript-eslint/no-duplicate-enum-values": "off", // enum 중복 값; TODO 보류
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error", // non-null assertion을 사용한 옵셔널 체이닝 금지
    "@typescript-eslint/no-explicit-any": "off", // any 사용 금지; TODO 보류
    "@typescript-eslint/ban-types": "off", // 특정 타입(별칭) 사용 금지; TODO 보류 (중괄호?)
    "@typescript-eslint/type-annotation-spacing": "error", // 타입 콜론간 공백
    "@typescript-eslint/adjacent-overload-signatures": "error", // 중복된 오버로드 시그니처
    "@typescript-eslint/array-type": "error", // 배열 타입
    "default-param-last": "off",
    "@typescript-eslint/default-param-last": "error", // 기본 매개변수 마지막
    "no-unused-vars": "off", // 기본 설정을 꺼준다
    "@typescript-eslint/no-unused-vars": ["error", { // 사용하지 않는 변수
      // TODO vue의 KeepAlive, Transition 무시
      "varsIgnorePattern": "_.*|KeepAlive|Transition",
      "argsIgnorePattern": "_.*",
      "args": "none",
    }],
    "@typescript-eslint/consistent-type-assertions": ["error", { // 일관된 타입 단언
      "assertionStyle": "as",
      "objectLiteralTypeAssertions": "allow",
    }],
    // "@typescript-eslint/consistent-type-exports": "off", // 일관된 타입 내보내기; TODO 보류
    "@typescript-eslint/consistent-type-imports": ["error", { // 일관된 타입 가져오기
      prefer: 'type-imports',
      disallowTypeAnnotations: true,
      fixStyle: 'separate-type-imports',
    }],
    "@typescript-eslint/consistent-type-definitions": "error", // 일관된 타입 정의 (interface)
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"], // 인덱스 시그니처 스타일
    "@typescript-eslint/prefer-for-of": "error", // for-of 사용 권장
    "@typescript-eslint/parameter-properties": [ // 생성자 매개변수 속성
      "error",
      {
        "allow": []
      }
    ],
    "@typescript-eslint/no-empty-interface": [ // 빈 인터페이스
      "error",
      {"allowSingleExtends": true},
    ],
    "@typescript-eslint/member-delimiter-style": ["error", { // 멤버 구분자
      "multiline": {
        "delimiter": "semi",
        "requireLast": true,
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": false,
      },
    }],
    "@typescript-eslint/indent": ["error", 2, {
      "MemberExpression": 1,
      "SwitchCase": 1,
      "VariableDeclarator": "first",
      "ImportDeclaration": "first",
      "ObjectExpression": "first",
      "ArrayExpression": "first",
      "CallExpression": {"arguments": "first"},
      "FunctionDeclaration": {"parameters": "first"},
    }],
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "tsconfigRootDir": __dirname,
    "ecmaVersion": "latest",
    "sourceType": "module",
    // "extraFileExtensions": [".vue"],
    // "project": ['tsconfig.lint.json'],
  },
};
