import styled from "styled-components";

// styled-components →
const InpBox = styled.div`
  margin: 0 auto 5px auto;
  width: 180px;
`;

const InpTitle = styled.div`
  color: rgb(55, 53, 47);
  font-size: 15px;
`;

const SelectBox = styled.div`
  border: 1px solid rgba(55, 53, 47, 0.16);
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Select = styled.select`
  width: 65px;
  height: 95%;
  font-size: 20px;
  border: none;
  text-align: right;
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  padding-right: 5px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Colon = styled.span`
  font-weight: 600;
`;
// ← styled-components

const SelectTime = (props) => {
  const hourNum = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const minuteNum = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ];

  return (
    <InpBox>
      <InpTitle>{props.inpTitle}</InpTitle>
      <SelectBox>
        <Select
          value={props.hours}
          onChange={(e) => props.changeHours(e.target.value)}
        >
          {hourNum.map((item) => {
            return <option key={item}>{item}</option>;
          })}
        </Select>
        <Colon>:</Colon>
        <Select
          value={props.minutes}
          onChange={(e) => props.changeMinutes(e.target.value)}
        >
          {minuteNum.map((item) => {
            return <option key={item}>{item}</option>;
          })}
        </Select>
      </SelectBox>
    </InpBox>
  );
};

export default SelectTime;
