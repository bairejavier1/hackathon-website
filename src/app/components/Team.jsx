import React from "react";
import { Row, Col } from "react-bootstrap";
import Member from "./Member";
import { RiVipCrown2Fill } from "react-icons/ri";
import { SiGithub, SiDevpost } from "react-icons/si";
import Tag from "./Tag";
import Checkbox from "./Checkbox";

const Teams = ({
  uid,
  teamName,
  github,
  devpost,
  status,
  members,
  selected,
  setFilteredTeams,
  filteredTeams,
}) => {
  const handleSelect = () => {
    if (!selected) {
      setFilteredTeams(
        filteredTeams.map((a) => {
          if (a.uid === uid) {
            a.selected = true;
          }
          return a;
        })
      );
    } else {
      setFilteredTeams(
        filteredTeams.map((a) => {
          if (a.uid === uid) {
            a.selected = false;
          }
          return a;
        })
      );
    }
  };

  return (
    <div>
      <Checkbox onClick={handleSelect} toggle={selected} />
      <div className="flex font-semibold pl-[5%] w-[35%]">
        <p className="m-0">{teamName}</p>
        {status == "winner" && (
          <RiVipCrown2Fill className="ml-2 text-yellow-500 text-xl" />
        )}
      </div>
      <Col className="flex">
        <div className="pl-[5%] m-0 w-[35%]">
          {members.map((member, index) => (
            <Row key={index}>
              <Member name={member.name} email={member.email} />
            </Row>
          ))}
        </div>
        <div className="flex flex-col justify-start items-start text-sm">
          <a
            href={github}
            rel="noreferrer"
            target="_blank"
            className="no-underline hover:opacity-70 text-black flex flex-row items-center"
          >
            <SiGithub className="text-lg mr-1" />
            {github}
          </a>
          <a
            href={devpost}
            rel="noreferrer"
            target="_blank"
            className=" no-underline hover:opacity-70 text-black flex flex-row items-center"
          >
            <SiDevpost className="text-lg mr-1" />
            {devpost}
          </a>
        </div>
        <div className="pl-[5%] m-0 w-[35%]">
          <Tag text={status} />
        </div>
      </Col>
      <div className="my-1 h-[2px] bg-hackathon-gray" />
    </div>
  );
};

export default Teams;
