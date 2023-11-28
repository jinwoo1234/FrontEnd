import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';
import DaumPostcode from 'react-daum-postcode';

// 아이콘
import ReportPaginationIcon from '../../../assets/images/reportPage/report2.png';

// 컴포넌트
import ReportHeader from '../../../components/reportPage/reportHeader/ReportHeader';
import UploadBox from '../../../components/uploadImg/UploadBox';
import axios from '../../../api/axios';

function Report2() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [eventSNS, setEventSNS] = useState(null);
  const [eventPhoneNumber, setEventPhoneNumber] = useState(null);
  const [eventWayToCome, setEventWayToCome] = useState(null);
  const [imgData, setImgData] = useState();

  // 우편번호 찾기 모달창
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleComplete = data => {
    setPostalCode(data.zonecode);
    setAddress(data.address);
    handleModalClose();
  };

  // 선택사항 append 함수
  function appendOptional(formData, fieldName, value) {
    if (value) {
      formData.append(fieldName, value);
    } else {
      formData.append(fieldName, null);
    }
  }

  // const file = null;

  const handleImgFile = file => {
    setImgData(file);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    // Form 데이터 생성
    const formData = new FormData();

    // 값 추출
    const eventName = document.querySelector('#eventName').value; // 행사명
    const eventPostalCode = postalCode; // 우편번호
    const eventAddress = address; // 도로명 주소
    const eventAddressDetail = document.querySelector(
      '#eventAddressDetail'
    ).value; // 상세주소
    const eventStartDate = document.querySelector('#eventStartDate').value; // 시작일
    const eventEndDate = document.querySelector('#eventEndDate').value; // 종료일
    const eventDescription = document.querySelector('#eventDescription').value; // 행사 설명
    const eventFee = document.querySelector('#eventFee').value; // 요금 정보
    setEventSNS(document.querySelector('#eventSNS').value); // SNS 주소
    setEventPhoneNumber(document.querySelector('#eventPhoneNumber').value); // 전화번호
    setEventWayToCome(document.querySelector('#eventWayToCome').value); // 오시는 길
    const eventImg = document.querySelector('#eventImg').value; // 행사 사진

    // Appernd
    // formData.append('eventName', eventName);
    // formData.append('eventPostalCode', eventPostalCode);
    // formData.append('eventAddress', eventAddress);
    // formData.append('eventAddressDetail', eventAddressDetail);
    // formData.append('eventStartDate', eventStartDate);
    // formData.append('eventEndDate', eventEndDate);
    // formData.append('eventDescription', eventDescription);
    // formData.append('eventFee', eventFee);
    formData.append('culturalEventReportDTO', {
      eventName: eventName,
      eventPostalCode: eventPostalCode,
      eventAddress: eventAddress,
      eventAddressDetail: eventAddressDetail,
      eventStartDate: eventStartDate,
      eventEndDate: eventEndDate,
      eventDescription: eventDescription,
      eventFee: eventFee,
    });

    formData.append('fileList', eventImg);
    // 선택적인 필드 값 확인 후 FormData에 추가
    // appendOptional(formData, 'eventSNS', eventSNS);
    // appendOptional(formData, 'eventPhoneNumber', eventPhoneNumber);
    // appendOptional(formData, 'eventWayToCome', eventWayToCome);
    // formData.append('eventImg', eventImg);

    // Content-Type 설정 : FormData
    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    try {
      console.log('formData: ', formData);
      const response = await axios.post('user/report', formData, { headers });

      console.log(response);

      if (response.status === 200) {
        navigate('/report3');
      }
    } catch (error) {
      alert('제보 실패 :(');
    }
  };

  return (
    <>
      {/* 헤더 */}
      <ReportHeader ReportPaginationIcon={ReportPaginationIcon} />
      <S.ReportWrapper>
        <S.ReportContent>
          <S.ReportRequired>* 는 필수 입력 사항입니다</S.ReportRequired>

          {/* 행사 폼 */}
          <S.ReportForm onSubmit={handleSubmit}>
            {/* 행사명 */}
            <S.ReportEvent>
              <S.ReportEventTitle>행사명 *</S.ReportEventTitle>
              <S.ReportEventInput
                type="text"
                id="eventName"
                placeholder="행사명을 입력해주세요."
                required
              />
            </S.ReportEvent>

            {/* 행사 위치 */}
            <S.ReportEvent>
              <S.ReportEventTitle>행사 위치 *</S.ReportEventTitle>
              <S.ReportEventAddressTop>
                <S.ReportEventAddressZipCode
                  type="text"
                  value={postalCode}
                  placeholder="우편번호를 입력하세요."
                  required
                />
                <S.ReportEventAddressZipCodeButton onClick={handleModalOpen}>
                  우편번호 찾기
                </S.ReportEventAddressZipCodeButton>

                {isModalOpen && (
                  <>
                    <S.ReportEvnetAddressModalBackground
                      onClick={handleModalClose}
                    />

                    <S.ReportEvnetAddressModal>
                      <DaumPostcode
                        onComplete={handleComplete}
                        autoClose
                        animation
                      />
                    </S.ReportEvnetAddressModal>
                  </>
                )}
              </S.ReportEventAddressTop>
              <S.ReportEventAddressMore
                type="text"
                value={address}
                placeholder="도로명 주소를 입력하세요."
                required
              />
              <S.ReportEventAddressMore
                type="text"
                id="eventAddressDetail"
                placeholder="상세 주소를 입력하세요."
                required
              />
            </S.ReportEvent>

            {/* 행사 기간 */}
            <S.ReportEvent>
              <S.ReportEventTitle>행사 기간 *</S.ReportEventTitle>
              <S.ReportEventDate>
                <S.ReportEventDateItem>
                  시작일
                  <S.ReportEventInputDate
                    type="date"
                    id="eventStartDate"
                    required
                  />
                </S.ReportEventDateItem>
                <S.ReportEventDateItem>
                  종료일
                  <S.ReportEventInputDate
                    type="date"
                    id="eventEndDate"
                    required
                  />
                </S.ReportEventDateItem>
              </S.ReportEventDate>
            </S.ReportEvent>

            {/* 행사 설명 */}
            <S.ReportEventTitle2>행사 설명 *</S.ReportEventTitle2>
            <S.ReportEventTextAreaWrap>
              <S.ReportEventTextArea
                id="eventDescription"
                placeholder="행사에 대해서 설명해주세요. (최소 30자 이상)"
                minLength={30}
                required
              />
            </S.ReportEventTextAreaWrap>

            {/* 요금 정보 */}
            <S.ReportEvent>
              <S.ReportEventTitle>요금 정보 *</S.ReportEventTitle>
              <S.ReportEventCost>
                <S.ReportEventInputRadioWrapper>
                  <S.ReportEventLabel>무료</S.ReportEventLabel>
                  <S.ReportEventInputRadio
                    type="radio"
                    id="eventFee"
                    name="options"
                    value="무료"
                    required
                  />
                </S.ReportEventInputRadioWrapper>

                <S.ReportEventInputRadioWrapper>
                  <S.ReportEventLabel>유료</S.ReportEventLabel>
                  <S.ReportEventInputRadio
                    type="radio"
                    id="eventFee"
                    name="options"
                    value="유료"
                  />
                </S.ReportEventInputRadioWrapper>
              </S.ReportEventCost>
            </S.ReportEvent>

            {/* SNS 주소 */}
            <S.ReportEvent>
              <S.ReportEventTitle>SNS 주소</S.ReportEventTitle>
              <S.ReportEventInput
                type="text"
                id="eventSNS"
                placeholder="행사 관련 SNS 주소를 입력해주세요."
              />
            </S.ReportEvent>

            {/* 전화번호 */}
            <S.ReportEvent>
              <S.ReportEventTitle>전화번호</S.ReportEventTitle>
              <S.ReportEventInput
                type="text"
                id="eventPhoneNumber"
                placeholder="행사 담당 전화번호를 입력해주세요."
              />
            </S.ReportEvent>

            {/* 행사 사진 */}
            <S.ReportEventTitle2>행사 사진</S.ReportEventTitle2>
            <S.ReportEventUploadBox>
              <UploadBox setFile={handleImgFile} />
            </S.ReportEventUploadBox>

            {/* 오시는 길 */}
            <S.ReportEvent>
              <S.ReportEventTitle>오시는 길</S.ReportEventTitle>
              <S.ReportEventInput
                type="text"
                id="eventWayToCome"
                placeholder="행사에 쉽게 올 수 있는 방법을 설명해주세요."
              />
            </S.ReportEvent>

            {/* 제보하기 버튼 */}
            <S.ReportButton type="submit">제보하기</S.ReportButton>
          </S.ReportForm>
        </S.ReportContent>
      </S.ReportWrapper>
    </>
  );
}

export default Report2;
