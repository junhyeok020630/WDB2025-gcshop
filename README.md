# GCShop - WDB2025

### 프로젝트 소개

GCShop은 Node.js, Express.js 및 MySQL을 사용하여 구축된 온라인 쇼핑몰 웹 애플리케이션입니다. 사용자, 상품, 게시판, 장바구니, 구매 관리 및 관리자 분석 페이지 등 다양한 기능을 제공합니다.

### 주요 기능

- **회원 관리**: 회원가입, 로그인, 로그아웃 기능 및 고객, 관리자, 경영자 등 사용자 등급에 따른 권한 관리.
- **상품 관리**: 관리자는 상품을 등록, 수정, 삭제할 수 있습니다. 고객은 상품을 조회하고 상세 정보를 확인할 수 있습니다.
- **장바구니 및 구매**: 고객은 상품을 장바구니에 담거나 바로 구매할 수 있으며, 구매 내역을 확인하고 구매를 취소할 수 있습니다.
- **게시판**: 일반 게시글 및 관리자 답변 기능이 있는 게시판 기능.
- **관리자 기능**:
  - **DB 관리**: 테이블, 코드, 게시판 유형, 회원 정보 등을 생성, 조회, 수정, 삭제하는 기능을 제공합니다.
  - **고객 분석**: 지역별 고객 분포를 파이 차트로 보여주는 경영자용 분석 페이지.

### 기술 스택

- **백엔드**: Node.js, Express.js
- **데이터베이스**: MySQL
- **템플릿 엔진**: EJS
- **프론트엔드**: HTML, CSS, JavaScript (Bootstrap, jQuery)
- **기타 모듈**: `express-session`, `express-mysql-session`, `body-parser`, `multer`, `sanitize-html`.

### 설치 및 실행 방법

1.  **프로젝트 클론**:

    ```bash
    git clone junhyeok020630/wdb2025-gcshop.git
    cd wdb2025-gcshop
    ```

2.  **Node.js 모듈 설치**:

    ```bash
    npm install express
    npm install body-parser
    npm install express-session
    npm install express-mysql-session
    npm install multer
    npm install sanitize-html
    npm install ejs
    npm install mysql
    ```

3.  **MySQL 데이터베이스 설정**:

    - MySQL 서버를 실행합니다.
    - `db.js` 파일에 명시된 대로 `webdb2025`라는 이름의 데이터베이스를 생성하고, 필요한 테이블을 만듭니다.
    - `db.js` 파일에서 데이터베이스 사용자 이름과 비밀번호를 환경에 맞게 수정합니다.

4.  **애플리케이션 실행**:

    ```bash
    node main.js
    ```

5.  **접속**:
    웹 브라우저에서 `http://localhost:3000`에 접속하여 애플리케이션을 사용할 수 있습니다.

### 제작자

- 최준혁 (202136049).
