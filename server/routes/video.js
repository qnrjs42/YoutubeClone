const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const { response } = require("express");
let ffmpeg = require('fluent-ffmpeg');

let storage = multer.diskStorage({
  // uploads 폴더에 저장
  destination: (req, file, cb) => {
    cb(null, "uploads/");

  },
  // 현재날짜에 파일이름 붙여서
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}+${file.originalname}`);
  },
  // mp4만 업로드
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.mp4') {
        return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

// client/VideoUploadPage/ Axios.post('/api/video/uploadfiles', formData, config) 요청
router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장
    upload(req, res, err => {
        if(err) {
            // 클라이언트에게 json 형태로 success 실패, 에러메시지 리턴
            return res.json({ success:false, err});
        }
        console.log(req.file);
        // 클라이언트에게 json 형태로 success 성공, 파일경로, 파일이름 리턴
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
});

router.post("/uploadVideo", (req, res) => {
  // 비디오 정보들을 저장

  // req.body -> 클라이언트에서 보낸 variables의 객체를 다 가져옴
  const video = new Video(req.body);

  // .save() -> mongoDB 저장
  video.save((err, doc) => {
    if(err) return res.json({ success: false, err })
    res.status(200).json({ success: true })
  });
});

router.post("/thumbnail", (req, res) => {
  // 썸네일 생성하고 비디오 정보(러닝타임) 가져오기

  let filePath = ''; // 파일 경로
  let fileDuration = ''; // 비디오 러닝 타임

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function(err, metadata) {
      console.dir(metadata);
      console.log(metadata.format.duration);
      fileDuration = metadata.format.duration;
  })

  // 썸네일 생성
  // req.body.url : 클라이언트에서 온 비디오 저장 경로(uploads 폴더)
    ffmpeg(req.body.url)
    // 썸네일 파일 이름 생성
    .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    })
    // 썸네일을 생성하고 난 후 행동
    .on('end', function() {
        console.log('Screenshots taken');
        // 클라이언트에게 전달 내용 -> 성공, 파일경로, 러닝타임
        return res.json({ success: true, url: filePath, fileDuration: fileDuration})
    })
    // 에러가 났을 때
    .on('error', function(err) {
        console.error(err);
        return res.json({ success: false, err});
    })
    // 옵션을 줄 수 있다, 3개의 썸네일을 찍음, 해당 폴더에 썸네일 저장, 파일 사이즈, 파일이름
    .screenshots({
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png',
    });
});


module.exports = router;