import immegration from "../Svg/324-3247530_file-airport-immigration-svg-immigration-symbol.svg";
import luggage from "../Svg/encrypted-tbn0_gstatic_com-images (3).svg 00-31-48-569.svg 00-33-53-653.svg";
import customs from "../Svg/912261-200.svg";
import security from "../Svg/encrypted-tbn0_gstatic_com-images (1).svg";
import terminal from "../Svg/encrypted-tbn0_gstatic_com-images (3).svg";
// import questionmark from "../Svg/354-3544377_faqs-free-question-mark-svg (1).svg";
import treasure from "../Svg/encrypted-tbn0_gstatic_com-images (6).svg";
// import plusOne from "../Svg/1200px-Ic_exposure_plus_1_48px.svg.svg";

const boardList = [
  true,
  true,
  {
    question: true,
    imgurl: treasure,
    type: "Immigration",
    questionType: "complete",
  },
  true,
  true,
  true,
  {
    checkpoint: true,
    imgurl: immegration,
    type: "Immigration",
    nextChallengeType: "Luggage",
  },
  true,
  {
    question: true,
    imgurl: treasure,
    type: "Luggage",
    questionType: "complete",
  },
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,

  {
    question: true,
    imgurl: treasure,
    type: "Security",
    questionType: "complete",
  },
  true,
  {
    checkpoint: true,
    imgurl: customs,
    type: "Customs",
    nextChallengeType: "Security",
  },
  true,
  true,
  true,
  {
    question: true,
    imgurl: treasure,
    type: "Customs",
    questionType: "complete",
  },
  true,
  {
    checkpoint: true,
    imgurl: luggage,
    type: "Luggage",
    nextChallengeType: "Customs",
  },
  true,
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  true,
  {
    checkpoint: true,
    imgurl: security,
    type: "Security",
    nextChallengeType: "Terminal",
  },
  true,
  {
    question: true,
    imgurl: treasure,
    type: "Terminal",
    questionType: "complete",
  },
  true,
  true,
  true,
  true,
  {
    checkpoint: true,
    imgurl: terminal,
    type: "Terminal",
    nextChallengeType: false,
  },
];

export default boardList;

// {
//   question: true,
//   imgurl: plusOne,
//   type: "Immigration",
//   questionType: "+1",
// },
// {
//   question: true,
//   imgurl: plusOne,
//   type: "Terminal",
//   questionType: "+1",
// },
// { question: true, imgurl: plusOne, type: "Luggage", questionType: "+1" },
// {
//   question: true,
//   imgurl: plusOne,
//   type: "Security",
//   questionType: "+1",
// },
// { question: true, imgurl: plusOne, type: "Customs", questionType: "+1" },
