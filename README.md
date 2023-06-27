# github를 이용한 CI/CD

1. github에 push

2. github에서 코드를 테스트

3. S3 서버에 FE를 올린다.

의 과정을 거쳐 배포할 수 있다.

## github Actions

- 상단의 workflow 생성하기
  
  - 우리는 익숙한 `node.js`로 workflow를 만든다.
  
  ```javascript
  on:
    push:
      branches: [ "master" ]
    pull_request:
      branches: [ "master" ]
  ```
  
  - **master branch**에 **push**할 시 하단의 **`jobs:` 부분을 실행**하겠다.
  
  ```javascript
  jobs:
    build:
  
      runs-on: ubuntu-latest
  
      strategy:
        matrix:
          node-version: [14.x, 16.x, 18.x]
          # See supported Node.js release schedule at https://nodejs.org/en/about/releases/
  
      steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
  
  ```
  
  - `runs-on: ubuntu-latest` : **우분투 환경**에서 실행
  
  - `node-version` : **몇 버전**에서 실행할 것인지
    
    (14버전에서 `step` 수행 -> 16버전에서 `step` 수행 -> 18버전에서 `step` 수행)
  
  - `steps` : 
    
    - `npm ci` => `npm i`
    
    - `--if-present` : build 파일이 있을 때만 실행하겠다.



## AWS S3 버킷 생성하기

- [AWS S3](https://s3.console.aws.amazon.com/s3/get-started?region=ap-northeast-2)

- 파일도 저장하고, 정적인 웹사이트를 배포할 때도 사용함
1. 버킷 생성

2. 버킷 **설정**하기
   
   속성 탭 - **정적 웹 사이트 호스팅**
   
   - 정적 웹 사이트 호스팅 활성화
   
   - 인덱스 문서 : `index.html`
     
     버킷 웹 사이트 엔드포인트 -> `403 Forbidden`

3. S3에 올라간 react 정적 파일을 웹에서 액세스 할 수 있게 **버킷 정책을 변경**
   
   (S3 버킷에 익명의 사용자들이 파일들을 조회할 수 있도록 권한 설정)
   
   권한 탭 - **퍼블릭 액세스 차단**
   
   - 활성화를 비활성화 하기
   
   권한 탭 - **버킷 정책**
   
   - [웹 사이트 액세스에 대한 권한 설정](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html)
   
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::react-github-action-bucket/*"
           }
       ]
   }
   ```
- `404 Not Found`

- Access할 수 있으나 파일이 존재하지 않음
  
  - **앱 자동 배포**를 통해 React에서 생성한 정적 파일을 업로드하자!



## yml 파일 완성하기

- `steps` 에서, `npm test`까지 무사히 완료되면 소스 코드를 S3 버킷에 업로드하도록 workflow 작성

- **IAM (Identity and Access Management)**
  
  - AWS 리소스에 대한 액세스를 안전하게 제어할 수 있는 웹 서비스
  
  - IAM을 사용하여 리소스를 사용하도록 인증 및 권한부여된 대상을 제어
  
  - IAM 사용자는 루트 사용자가 부여한 권한만 가진다
