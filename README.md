# 🛒 GC-Shop WDB2025

> **"Node.js와 MySQL을 활용한 강력한 통합 쇼핑몰 및 관리 시스템"**
> 사용자 쇼핑 환경부터 관리자용 데이터 분석 기능까지 아우르는 풀스택 웹 애플리케이션입니다.

<div align=center>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/EJS-A91E50?style=for-the-badge&logo=ejs&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
</div>

---

## 📖 소개

**가촌숍(GC-Shop)**은 효율적인 상품 관리와 사용자 친화적인 구매 여정을 제공하기 위해 설계된 쇼핑몰 플랫폼입니다. Express 프레임워크를 기반으로 한 리버스 프록시 구조와 세밀한 데이터베이스 설계를 통해 안정적인 서비스 환경을 구축하였습니다.

- 🛍️ **E-Commerce 핵심 구현**: 상품 검색, 장바구니, 결제 및 구매 이력 관리 시스템 완비
- 🛠️ **관리자 대시보드**: 상품 등록/수정뿐만 아니라 고객 분석(Analytics) 기능을 통해 매출 데이터 시각화 지원
- 💬 **커뮤니티 강화**: 게시판 시스템(Q&A, 공지사항 등)을 통합하여 고객 소통 창구 마련
- 🔐 **보안 인증**: 세션 기반의 안전한 로그인 및 권한 관리 시스템 적용

---

## ✨ 주요 기능

| 기능 | 상세 설명 |
|:---:|---|
| 🔐 **회원 및 권한 관리** | 회원가입, 로그인 및 사용자별 권한(관리자/일반)에 따른 메뉴 차별화 |
| 📦 **상품 관리 시스템** | CRUD 기반의 상품 등록, 카테고리별 분류 및 상세 정보 렌더링 |
| 🛒 **주문/결제 프로세스** | 장바구니 담기, 수량 조절 및 데이터베이스 연동을 통한 실시간 구매 처리 |
| 📋 **통합 게시판** | 답변형 게시판 구조 지원으로 원활한 고객 지원 및 정보 공유 가능 |
| 📊 **고객 및 매출 분석** | `customerAnal` 기능을 통한 구매 패턴 분석 및 테이블 기반 데이터 시각화 |

---

## 🚀 실행 가이드

이 프로젝트는 Node.js와 MySQL(MariaDB) 환경에서 작동합니다.

### 1️⃣ 데이터베이스 설정
* `lib/db.js` 파일에서 본인의 MySQL 접속 정보(Host, User, Password)를 설정합니다.
* 제공된 초기 SQL 스크립트가 있다면 데이터베이스에 적용하여 테이블을 생성합니다.

### 2️⃣ 의존성 설치 및 실행
터미널에서 아래 명령어를 순서대로 입력합니다.
```bash
# 패키지 설치
npm install

# 서버 실행
node main.js
```

### 3️⃣ 서비스 접속
* 브라우저에서 `http://localhost:3000` (또는 설정된 포트)으로 접속합니다.

---

## 📁 프로젝트 구조

```bash
wdb2025-gcshop/
├── 📂 lib/                  # 비즈니스 로직 및 DB 모듈
│   ├── 📄 db.js             # MySQL 커넥션 설정
│   ├── 📄 auth.js           # 인증 및 권한 로직
│   └── 📄 product.js        # 상품 처리 엔진
├── 📂 router/               # Express 라우터 (기능별 분리)
│   ├── 📄 productRouter.js  # 상품 관련 경로 제어
│   ├── 📄 purchaseRouter.js # 구매 및 장바구니 제어
│   └── 📄 boardRouter.js    # 게시판 기능 제어
├── 📂 views/                # EJS 템플릿 (UI 레이아웃)
│   ├── 📄 mainFrame.ejs     # 메인 인터페이스 구조
│   └── 📄 customerAnal.ejs  # 분석 대시보드 화면
├── 📂 public/               # 정적 리소스 (CSS, 이미지)
└── 📄 main.js               # Express 서버 엔트리 포인트
```

---

## 🛠️ 기술 스택 (Tech Stack)

### **Backend & Engine**
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

### **Frontend & Template**
![EJS](https://img.shields.io/badge/EJS-A91E50?style=for-the-badge&logo=ejs&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

---
