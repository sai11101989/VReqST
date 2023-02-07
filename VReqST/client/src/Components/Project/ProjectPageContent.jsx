import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  Textarea,
} from "@chakra-ui/react";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { FaExclamationCircle } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";

import isJson from "../../utils/checkjson";
import e from "cors";

let errors = [];
let rules = [];
let valid_rule = [];
let grammarDataArray = [];
let flag = false;
let fl = false;

const tipcolors = {
  number: "orange",
  object: "green",
  boolean: "red",
  string: "yellow",
  array: "blue",
};

const jsonValidator = (grammar, validating) => {

  console.log(grammar);
  const keys = Object.keys(grammar);
  const keys22 = Object.keys(validating);


  const grammarArray = Object.keys(grammar).filter(
    (value) => !Object.keys(validating).includes(value)
  );

  const extraEntries = Object.keys(validating).filter(
    (value) => !Object.keys(grammar).includes(value)
  );

  extraEntries.map((en) => {
    let app = 1;

    for (let i = 0; i < keys.length; i++) {

      if (keys[i] === en || grammar[keys[i]].root === en || grammar[keys[i]].proot === en) {
        app = 0;
      }
    }
    if (app) {
      errors.push(`"${en}" is invalid key in the JSON`);
    }
  });
  // const grammarArray = Object.keys(grammar).filter(
  //   (value) =>
  //   {var app=1;
  //     for(let i=0; i<keys22.length; i++)
  //     {
  //       if(value===validating[keys22[i]]||value===validating[keys22[i]].root||value===validating[keys22[i]].proot)
  //       {
  //         app=0;
  //       }
  //     }
  //     if(app===1)
  //     {


  //     }
  // )
  grammarArray.map((en) => {
    let app = 1;
    //alert(en);
    for (let i = 0; i < keys22.length; i++) {
      //console.log(validating[keys22[i]]);
      console.log(grammar[en] + " " + grammar[en].root + " " + grammar[en].proot);
      if (en === keys22[i] || grammar[en].root === keys22[i] || grammar[en].proot === keys22[i]) {
        app = 0;
      }
    }
    if (app === 1) {
      errors.push(
        `"${en}" is a mandatory field! Please add the field with ${grammar[en].typeof} type`
      );

    }
  })


  // })
  // grammarArray.map((en) => {
  //     if (grammar[en].req === "mandatory") {
  //         errors.push(
  //             `"${en}" is a mandatory field! Please add the field with ${grammar[en].typeof} type`
  //         );
  //     }
  // });

  //const keys = Object.keys(grammar);

  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    //alert(key);
    //alert(grammar[key].root);
    // If optional key is not present
    // we check the root
    if (grammar[key].hasOwnProperty('proot')) {
      //alert(key);
      // implies that we have a proot in the key
      let a = validating[grammar[key].proot];
      for (let i = 0; i < a.length; i++) {
        let c = a[i];
        //console.log(c);
        if (c.hasOwnProperty(grammar[key].root)) {
          //alert(c[grammar[key].root]);
          console.log(key + "" + c[grammar[key].root][key]);

          if (typeof c[grammar[key].root][key] === grammar[key].typeof) {
            //alert("Yay!!!!")
          }
          else {
            //errors.push(`"${key}" has invalid type, expected "${grammar[key].typeof}"`);
            //alert("FAILURE");
            if (typeof c[grammar[key].root][key] === "undefined") {
              errors.push(
                `"${key}" is a mandatory field! Please add the field with ${grammar[key].typeof} type`
              );

            }
            else {
              errors.push(
                ` "${key}" has an invalid type of '${typeof c[grammar[key].root][key]}'. Expected type of ${grammar[key].typeof}`
              );
            }
            //errors.push(`error`);
          }
        }
      }
    }
    else if (grammar[key].hasOwnProperty('repeat') && grammar[key].repeat === "allow") {
      let a = grammar[key].root;
      var obje = Object.keys(validating);
      let found = obje.indexOf(a);
      ////alert(a);

      if (typeof validating[a] === "object") {
        for (let i = 0; i < validating[a].length; i++) {
          ////alert(validating[a][i][key])
          if (typeof validating[a][i][key] === grammar[key].typeof || (typeof validating[a][i][key] === "object" && grammar[key].typeof === "array")) {
            //alert("Sucess");
            console.log("hello there");
          }
          else {
            //alert("FAILURE");
            if (typeof validating[a][i][key] === "undefined") {
              errors.push(
                `"${key}" is a mandatory field! Please add the field with ${grammar[key].typeof} type`
              );
            }
            else {
              errors.push(
                ` "${key}" has an invalid type of '${typeof validating[a][i][
                key
                ]}'. Expected type of ${grammar[key].typeof}`
              );
            }

            //errors.push(`JSON SYNTAX NOT CORRECT`);
            //errors.push(`error`);
            console.log("helo there");
          }
        }

      }

    }
    else {
      if (grammar[key].root === 'null' || grammar[key].root === 'undefined' || (!grammar[key].hasOwnProperty('root'))) {

        if (typeof validating[key] === "undefined") {
          continue;
        }

        // Handling nested objects recursively
        if (
          typeof validating[key] === "object" &&
          grammar[key].typeof === "object"
        ) {
          //alert("sucess");
          //jsonValidator(grammar[key], validating[key]);
          continue;
        }

        if (typeof validating[key] !== grammar[key].typeof) {
          errors.push(
            ` "${key}" has an invalid type of '${typeof validating[
            key
            ]}'. Expected type of ${grammar[key].typeof}`
          );
          //errors.push(`error`);
        }
        else {
          //alert("sucess");
        }

        if (
          typeof validating[key] === "string" &&
          typeof validating[key] === grammar[key].typeof &&
          grammar[key].req === "mandatory" &&
          validating[key].length === 0
        ) {
          errors.push(`"${key}" is mandatory, empty string is not allowed`);
        }
      }
      else {
        //alert(key);

        let a = grammar[key].root;
        if (false) {
          for (let i = 0; i < validating[a].length; i++) {
            if (typeof validating[a][i].key === grammar[key].typeof) {
              alert("Sucess");
            }
            else {
              //alert("Failure");
              //errors.push("kindly see the json syntax");
              errors.push(`"${key}" has invalid type, expected "${grammar[key].typeof}"`);
            }
          }
        }
        else {
          var b = validating[a];
          //alert(a);
          let c = Object.keys(b);
          let found = c.indexOf(key)
          if (typeof validating[a][c[found]] === grammar[key].typeof || (typeof validating[a][c[found]] === "object" && grammar[key].typeof === "array")) {
            //alert("Sucess!!!!!!");
          }
          else {
            //errors.push(`"${key}" has invalid type, expected "${grammar[key].typeof}"`);
            //alert("Fail");
            //errors.push(`error`);
            if (typeof validating[a][c[found]] === "undefined") {
              errors.push(
                `"${key}" is a mandatory field! Please add the field with ${grammar[key].typeof} type`
              );

            }
            else {
              errors.push(
                ` "${key}" has an invalid type of '${typeof validating[a][c[found]]
                }'. Expected type of ${grammar[key].typeof}`
              );
            }
          }
        }

      }
    }
  }

  if (errors.length > 0) {
    //alert("helllo");
    console.log(errors);
    return true;
  }

  return false;
};

// () => {
//   handleValidateButton();
//   setSeed(Math.random());
// }


const ProjectPageContent = ({
  stepslen,
  nextStep,
  prevStep,
  reset,
  activeStep,
  scene,
  action,
  asset,
  projectname,
  timeline,
  custom,
}) => {
  const toast = useToast();
  const [files, setfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setdata] = useState("");
  const [grammarid, setGrammarid] = useState("");
  const [validated, setValidated] = useState(false);
  // const [grammarData, setGrammarData] = useState({});
  const [grammarbundle, setGrammarbundle] = useState({});
  const [displayErrors, setDisplayErrors] = useState([]);
  const [valid_rule_list, setvalid_rule] = useState([]);

  const [downloadable, setDownloadable] = useState(false);
  let [val, setValue] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [description, set_description] = useState("");
  const [perdata, set_perdata] = useState("");
  const [seed, setSeed] = useState(0);
  const { projectid } = useParams();
  const [rulename, setRulename] = useState("");
  const jwttoken = localStorage.getItem("jwtToken");

  // const pregrammar = async () => {
  //   const requestOptions = {
  //     headers: { "Content-Type": "application/json", token: jwttoken },
  //   };
  //   const res = await Axios.get(
  //     `http://localhost:5002/api/project/${projectid}/grammarName`,
  //     requestOptions
  //   );
  // }

  const getfiles = async () => {
    let url = "";
    // console.log("hey");
    url = `http://localhost:5002/api/json/timeline`;
    // if (activeStep === 0) url = `http://localhost:5002/api/json/scene`;
    // else if (activeStep === 1) url = `http://localhost:5002/api/json/scene`;
    // else if (activeStep === 2) url = `http://localhost:5002/api/json/scene`;
    // else if (activeStep === 3) url = `http://localhost:5002/api/json/scene`;
    // else if (activeStep === 4) url = `http://localhost:5002/api/json/scene`;
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.get(url, requestOptions);
      // console.log(res);
      ////////////////////////
      const requestOption = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res2 = await Axios.get(
        `http://localhost:5002/api/project/${projectid}/grammarName`,
        requestOption
      );
      console.log(res2.data.grammarName);
      setfiles(res.data);
      console.log(res.data);
      // console.log(files);
      res.data.map((p) => {
        console.log(p.name);

        if (p.name == res2.data.grammarName) {
          console.log(p);
          console.log("lljiouio");
          if (grammarDataArray.length != 5) {
            grammarDataArray.push(p.scene);
            grammarDataArray.push(p.asset);
            grammarDataArray.push(p.action);
            grammarDataArray.push(p.custom);
            grammarDataArray.push(p.timeline);
          }
          console.log("khgkujtkuytkuytyut");
          console.log(grammarDataArray);
        }
      })

      // setfiles(res.data);
    } catch (error) {
      toast({
        title: "Something went wrong 1",  //Goes wrong
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const f = async () => {
      setLoading(true);
      await getfiles();
      setLoading(false);
    };

    f();
  }, []);

  useEffect(() => {
    getfiles();
    if (activeStep == 0) {
      setdata(scene);
      getfiles();
      fl = false;
      if (isJson(scene)) {
        setDownloadable(true);
      }
    }
    if (activeStep == 1) {
      setdata(asset);
      fl = false;
      if (isJson(asset)) {
        setDownloadable(true);
      }
    }
    if (activeStep == 2) {
      setdata(action);
      fl = false;
      if (isJson(action)) {
        setDownloadable(true);
      }
    }
    if (activeStep == 3) {
      setdata(custom);
      fl = false
      if (isJson(custom)) {
        setDownloadable(true);
      }
    }
    if (activeStep == 4) {
      setdata(timeline);
      fl = false;
      if (isJson(timeline)) {
        setDownloadable(true);
      }
    }
  }, []);
  const downloadTxtFile = () => {
    if (data === "" || !isJson(data)) {
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setDownloadable(false);
      return;
    }
    let fileName = "";
    if (activeStep === 0) fileName = "scene";
    if (activeStep === 1) fileName = "asset";
    if (activeStep === 2) fileName = "action";
    if (activeStep === 3) fileName = "custom";
    if (activeStep === 4) fileName = "timeline";
    const json = data;
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const downlink = document.createElement("a");
    downlink.href = href;
    downlink.download = projectname + "-" + fileName + ".json";
    document.body.appendChild(downlink);
    downlink.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(downlink);
    URL.revokeObjectURL(href);
  };
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  let onValidate2 = async () => {
    toast({
      title: "Validation successfull",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
    console.log("output");
    setDownloadable(true);
    // rules = displayRules;
    valid_rule.push({
      rulename: rulename,
      data_name: data,
      description: description,
    });
    // setvalid_rule(valid_rule);
    console.log(valid_rule);
  };
  // const permanent = async () => {
  //   set_perdata(valid_rule);
  //   toast({
  //     title: perdata,
  //     status: "error",
  //     duration: 10000,
  //     isClosable: true,
  //     position: "top",
  //   });

  //   setDownloadable(false)

  // }

  const onValidate = async () => {
    if (!isJson(data)) {
      setValidated(false);
      setDownloadable(false);
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setDisplayErrors([]);
    errors = [];
    var myjson = JSON.parse(data);
    // try {
    //   if (activeStep == 2) {
    //     try {
    //       {
    //         rules = myjson.objlist;
    //         var a = myjson.ObjAction;
    //         //console.log(a[0]);
    //         //alert(a[0]);
    //         for (let i = 0; i < a.length; i++) {
    //           var c = a[i].actresid;
    //           //  console.log(c);
    //           flag = true;
    //           rules.push(c);
    //         }
    //       }
    //     }
    //     catch (e) {
    //       console.log(e);
    //       setValidated(false);
    //       setDownloadable(false);
    //     }
    //   }
    // }
    // catch {
    //   console.log(e);
    // }
    // if (grammarDataArray.length === 0) {
    //   await getfiles();
    //   //var temp=Object.keys(grammarDataArray);
    //   // console.log(grammarDataArray);
    // }

    // console.log(grammarDataArray[0]);
    try {
      var mygrm = "";
      if (activeStep == 0) mygrm = JSON.parse(grammarDataArray[0]);
      else if (activeStep == 1) mygrm = JSON.parse(grammarDataArray[1]);
      else if (activeStep == 2) mygrm = JSON.parse(grammarDataArray[2]);
      else if (activeStep == 3) mygrm = JSON.parse(grammarDataArray[3]);
      else if (activeStep == 4) mygrm = JSON.parse(grammarDataArray[4]);
    } catch (e) {
      console.log(e);
    }

    try {
      if (activeStep == 2) {
        try {
          {
            // rules = myjson.objlist;
            var a = myjson.ObjAction;
            //console.log(a[0]);
            //alert(a[0]);
            for (let i = 0; i < a.length; i++) {
              var c = a[i].actresid;
              //  console.log(c);
              flag = true;
              if (c) {
                rules.push(c);
              }
            }
          }
        } catch (e) {
          console.log(e);
          setValidated(false);
          setDownloadable(false);
          toast({
            title:
              "There are errors in the entered JSON, please check them out!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }
      } else if (activeStep == 1) {
        try {
          {
            var a = myjson.articles;
            //console.log(a[0]);
            //alert(a[0]);
            for (let i = 0; i < a.length; i++) {
              var c = a[i]._objectname;
              //  console.log(c);
              flag = true;
              if (c) {
                rules.push(c);
              }
            }
          }
        } catch (e) {
          console.log(e);
          setValidated(false);
          setDownloadable(false);
          toast({
            title:
              "There are errors in the entered JSON, please check them out!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }
      }
    } catch {
      console.log(e);
    }
    if (grammarDataArray.length === 0) {
      await getfiles();
      //var temp=Object.keys(grammarDataArray);
      // console.log(grammarDataArray);
    }


    try {
      let mygrm = "";
      if (activeStep == 0) mygrm = JSON.parse(grammarDataArray[0]);
      else if (activeStep == 1) mygrm = JSON.parse(grammarDataArray[1]);
      else if (activeStep == 2) mygrm = JSON.parse(grammarDataArray[2]);
      else if (activeStep == 3) mygrm = JSON.parse(grammarDataArray[3]);
      else if (activeStep == 4) mygrm = JSON.parse(grammarDataArray[4]);


      if (!jsonValidator(mygrm, myjson)) {
        setValidated(true);
        setDownloadable(true);
        toast({
          title: "JSON Validated Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        console.log(errors);
        toast({
          title: "There are errors in the entered JSON, please check them out!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
      // console.log(typeof errors);
      setDisplayErrors(errors);
    }
    catch (e) {
      console.log(e);
      toast({
        title: "There are errors in the entered JSON, please check them outkljljulij!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // const onChangeFile = async (e) => {
  //   setGrammarid(e.target.value);
  //   if (!e.target.value) {
  //     setGrammarData({});
  //     return;
  //   }
  //   try {
  //     const requestOptions = {
  //       headers: { "Content-Type": "application/json", token: jwttoken },
  //     };
  //     const res = await Axios.get(
  //       `http://localhost:5002/api/json/${e.target.value}`,
  //       requestOptions
  //     );
  //     const grammarjson = JSON.parse(res.data.data);
  //     setGrammarData(grammarjson);
  //   } catch (error) {
  //     toast({
  //       title: "Something went wrong 4",
  //       status: "error",
  //       duration: 10000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //     console.log(error);
  //   }
  // };

  // const onChangeFile = async (e) => {
  //   setGrammarid(e.target.value);
  //   if (!e.target.value) {
  //     // setGrammarData({});
  //     return;
  //   }
  //   try {
  //     //   if(activeStep==0) setGrammarData
  //     //   if(activeStep==0) setGrammarData(grammarbundle.scene)
  //     //  else if(activeStep==1) setGrammarData(grammarbundle.asset)
  //     //  else if(activeStep==2) setGrammarData(grammarbundle.action)
  //     //  else if(activeStep==3) setGrammarData(grammarbundle.custom)
  //     //  else if(activeStep==4) setGrammarData(grammarbundle.timeline)
  //   } catch (error) {
  //     toast({
  //       title: "Something went wrong 4",
  //       status: "error",
  //       duration: 10000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //     console.log(error);
  //   }
  // };
  const showValidateHandler = async () => {
    console.log(data);
    let code = data;
    let jsonData = JSON.stringify({
      types: [
        {
          type: "if",
          order: [["condition"], ["scope"]],
        },

        {
          type: "else",
          prev: ["If", "EIf"],
          order: [["scope"]],
        },

        {
          type: "else-if",
          prev: ["If", "EIf"],
          order: [["condition"], ["scope"]],
        },

        {
          type: "switch",
          order: [["condition"], ["scope", ["Case"], ["Default"]]],
        },

        {
          type: "switch-case",
          order: [["condition"], ["scope"]],
        },

        {
          type: "switch-case-default",
          order: [["scope"]],
        },

        {
          type: "for",
          order: [
            ["condition", ["conditionSeparator", "conditionSeparator"]],
            ["scope"],
          ],
        },

        {
          type: "while",
          order: [["condition"], ["scope"]],
        },

        {
          type: "do",
          order: [["scope"]],
          next: ["Do-While"],
        },

        {
          type: "do-while",
          order: [["condition"]],
          prev: ["Do"],
        },
      ],
      constructs: [
        {
          name: "If",
          type: "if",
          conditionStart: "#",
          conditionEnd: "#",
          scopeStart: ":",
          scopeEnd: "!",
        },

        {
          name: "EIf",
          type: "else-if",
          conditionStart: "#",
          conditionEnd: "#",
          scopeStart: ":",
          scopeEnd: "!",
          pre: ["If", "EIf"],
        },

        {
          name: "E",
          type: "else",
          scopeStart: ":",
          scopeEnd: "!",
          pre: ["If", "EIf"],
        },

        {
          name: "Switch",
          type: "switch",
          conditionStart: "#",
          conditionEnd: "#",
          body: "Case",
          scopeStart: ":",
          scopeEnd: "!",
          "end-body": "default",
        },

        {
          name: "Case",
          type: "switch-case",
          conditionStart: "#",
          conditionEnd: "#",
          scopeStart: ":",
          scopeEnd: "!",
          parent: "Switch",
        },

        {
          name: "Default",
          type: "switch-case-default",
          scopeStart: ":",
          scopeEnd: "!",
          parent: "Switch",
        },

        {
          name: "For",
          type: "for",
          conditionStart: "#",
          conditionEnd: "#",
          conditionSeparator: "/",
          scopeStart: ":",
          scopeEnd: "!",
        },

        {
          name: "While",
          type: "while",
          conditionStart: "#",
          conditionEnd: "#",
          scopeStart: ":",
          scopeEnd: "!",
        },

        {
          name: "Do",
          type: "do",
          scopeStart: ":",
          scopeEnd: "!",
          next: "Do-While",
        },

        {
          name: "Do-While",
          type: "do-while",
          conditionStart: "#",
          conditionEnd: "#",
        },
      ],
      specialSymbols: ["#", ":", "!", "/"],
    });

    console.log(jsonData);
    fetch(`http://localhost:5001/api/upload`, {
      method: "POST",
      body: jsonData,
    }).then((response) => {
      response.json().then((val) => {
        console.log("Uploaded");
        console.log(jsonData);
      });
      // console.log(`Response: ${response.json()}`)
    });

    fetch(`http://localhost:5001/api/process`, {
      method: "POST",
      body: code,
    }).then((response) => {
      response.json().then((val) => {
        console.log("Validation response from server");
        console.log(val);
        if (val.valid) {
          onValidate2();
        } else {
          setValidated(false);
          setDownloadable(false);
          toast({
            title: "Error! Please follow conditional syntax.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          return;
        }
      });
    });
  };

  const handleValidateButton = () => {
    console.log("Showing");
    showValidateHandler(true);
  };

  const onNextStep = async () => {
    if (!isJson(data) && activeStep !== 3) {
      setValidated(false);
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSubmitting(true);
    let url = "";
    if (activeStep === 0)
      url = `http://localhost:5002/api/project/${projectid}/scene`;
    else if (activeStep === 1)
      url = `http://localhost:5002/api/project/${projectid}/asset`;
    else if (activeStep === 2)
      url = `http://localhost:5002/api/project/${projectid}/action`;
    else if (activeStep === 3) {
      url = `http://localhost:5002/api/project/${projectid}/custom`;
    }
    else if (activeStep === 4)
      url = `http://localhost:5002/api/project/${projectid}/timeline`;
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.patch(url, { data }, requestOptions);

      toast({
        title: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Something went wrong 3",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top",
      });
      console.log(error);
    }
    setSubmitting(false);
    // if (activeStep == 2) {
    //   activeStep = 3;
    //   return;
    // }

    nextStep();
  };
  const handel_name = (e) => {
    setRulename(e.target.value);
  };

  const handel_description = (e) => {
    set_description(e.target.value);
  };

  const onFinish = async () => {
    if (!isJson(data)) {
      setValidated(false);
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSubmitting(true);
    let url = "";
    if (activeStep === 0)
      url = `http://localhost:5002/api/project/${projectid}/scene`;
    else if (activeStep === 1)
      url = `http://localhost:5002/api/project/${projectid}/asset`;
    else if (activeStep === 2)
      url = `http://localhost:5002/api/project/${projectid}/action`;
    else if (activeStep === 3) {
      url = `http://localhost:5002/api/project/${projectid}/custom`;
    }
    else if (activeStep === 4)
      url = `http://localhost:5002/api/project/${projectid}/timeline`;
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.patch(url, { data }, requestOptions);

      toast({
        title: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Something went wrong 2",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top",
      });
      console.log(error);
    }
    setSubmitting(false);
    onOpen();
  };

  return loading ? (
    <>
      <Flex
        width={"80vw"}
        height={"90vh"}
        justifyContent="center"
        alignItems={"center"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    </>
  ) : (
    <>
      {activeStep !== 3 ? (
        <Grid templateColumns="repeat(6, 1fr)" gap={4}>
          <GridItem rowSpan={3} colSpan={1}>
            <Flex flexDir={"column"} pr={20} pt={120}>
              {/* {Object.keys(grammarData).length > 0 ? (
              <>
                {Object.keys(grammarData).map((e, i) => (
                  <Tooltip key={i} label={grammarData[e]["%comment%"]}>
                    <CustomCard
                      colorScheme={tipcolors[grammarData[e].typeof]}
                      variant={
                        grammarData[e].req === "mandatory" ? "solid" : "outline"
                      }
                      cursor="pointer"
                    >
                      {e}: {grammarData[e].typeof}
                    </CustomCard>
                  </Tooltip>
                ))}
              </>
            ) : (
              <Flex
                flexDir={"row"}
                alignItems="center"
                minH="60vh"
                justifyContent={"center"}
                pl="50px"
              >
                Please select a grammar file to validate
              </Flex>
            )} */}
            </Flex>
          </GridItem>
          <GridItem rowSpan={3} colSpan={3}>
            <Flex py={4} alignItems={"center"} flexDir="column">
              {/* <Select
              placeholder="Select Grammar File"
              py={4}
              maxW={80}
              // onChange={onChangeFile}
              defaultValue={grammarid}
            > */}
              {/* {files.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.scene}
                </option>
              ))} */}
              {/* </Select> */}
              <Flex marginTop={20} marginBottom={10}>
                <AceEditor
                  fontSize={16}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  mode="json"
                  theme="terminal"
                  onChange={(newvalue) => {
                    setdata(newvalue);
                    setDownloadable(false);
                    // fl = false;
                  }}
                  value={data}
                  name="grammar-editor"
                  wrapEnabled
                  height="40em"
                  width={"40em"}
                />
              </Flex>
              <Stack py={4} direction="row">
                <Button
                  colorScheme="yellow"
                  disabled={!data}
                  onClick={onValidate}
                >
                  Validate
                </Button>
                <Button
                  colorScheme="green"
                  disabled={!downloadable}
                  onClick={downloadTxtFile}
                  leftIcon={<BiDownload />}
                >
                  Download File
                </Button>
              </Stack>

              {activeStep === stepslen ? (
                <Flex px={4} py={4} width="100%" flexDirection="column">
                  <Heading fontSize="xl" textAlign="center">
                    Woohoo! All steps completed!
                  </Heading>
                  <Button mx="auto" mt={6} size="sm" onClick={reset}>
                    Reset
                  </Button>
                </Flex>
              ) : (
                <Flex width="100%" justify="flex-end">
                  <Button
                    isDisabled={activeStep === 0}
                    mr={4}
                    onClick={prevStep}
                    size="sm"
                    variant={"outline"}
                  >
                    Prev
                  </Button>

                  {activeStep === stepslen - 1 ? (
                    <Button
                      size="sm"
                      onClick={onFinish}
                      disabled={!validated}
                      isLoading={submitting}
                      colorScheme="green"
                      variant={"outline"}
                    >
                      Finish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={onNextStep}
                      disabled={!validated}
                      isLoading={submitting}
                      colorScheme="yellow"
                      variant={"outline"}
                    >
                      Next
                    </Button>
                  )}
                </Flex>
              )}
            </Flex>
          </GridItem>
          <GridItem rowSpan={3} colSpan={2} pt={120}>
            <Flex flexDir={"column"} pl={20}>
              {displayErrors.length > 0 ? (
                <List spacing={2}>
                  {displayErrors.map((e, i) => {
                    let str = "";
                    const splitarr = e.match(/(?:[^\s"]+|"[^"]*")+/g);
                    let Val;
                    if (splitarr.length === 12) {
                      splitarr.map(
                        (m, i) => i !== 0 && i !== 10 && (str = str + " " + m)
                      );
                      Val = () => (
                        <>
                          <Text as="span">
                            <Text
                              as="span"
                              fontWeight={"bold"}
                              color={tipcolors[splitarr[10]]}
                            >
                              {splitarr[0]}
                            </Text>
                            <Text as="span">{str}</Text>
                            <Text
                              as="span"
                              fontWeight={"bold"}
                              color={tipcolors[splitarr[10]]}
                            >
                              {" " + splitarr[10]}
                            </Text>
                          </Text>
                        </>
                      );
                    }

                    if (splitarr.length === 7 || splitarr.length === 8) {
                      splitarr.map((m, i) => i !== 0 && (str = str + " " + m));
                      Val = () => (
                        <>
                          <Text as="span">
                            <Text
                              as="span"
                              fontWeight={"bold"}
                              color={"teal.400"}
                            >
                              {splitarr[0]}
                            </Text>
                            <Text as="span">{str}</Text>
                          </Text>
                        </>
                      );
                    }

                    if (splitarr.length === 11) {
                      splitarr.map(
                        (m, i) => i !== 0 && i !== 10 && (str = str + " " + m)
                      );
                      Val = () => (
                        <>
                          <Text as="span">
                            <Text
                              as="span"
                              fontWeight={"bold"}
                              color={tipcolors[splitarr[10]]}
                            >
                              {splitarr[0]}
                            </Text>
                            <Text as="span">{str}</Text>
                            <Text
                              as="span"
                              fontWeight={"bold"}
                              color={tipcolors[splitarr[10]]}
                            >
                              {" " + splitarr[10]}
                            </Text>
                          </Text>
                        </>
                      );
                    }

                    return (
                      <ListItem key={i}>
                        <ListIcon as={FaExclamationCircle} color="red.500" />
                        {<Val />}
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <></>
              )}
            </Flex>
          </GridItem>
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                <Box textAlign="center" py={10} px={6}>
                  <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
                  <Heading as="h2" size="xl" mt={6} mb={2}>
                    JSON Validation Successful!
                  </Heading>
                  <Text color={"gray.500"}>
                    We have made sure that your data is free from any data-types
                    or syntax errors. Happy Development!
                  </Text>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => {
                  onClose();
                  // history.push("/projects");
                }}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Grid>
      ) : (
        <>
          <Tabs isFitted variant="enclosed" marginTop={10}>
            <TabList mb="1em">
              <Tab>Write</Tab>
              <Tab>Read</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>
                  <Grid templateColumns="repeat(6, 1fr)" gap={4}>
                    {/* <GridItem rowSpan={3} colSpan={1}> */}
                    {/* <Flex flexDir={"column"} pr={20} pt={120}>
                        {Object.keys(grammarData).length > 0 ? (
                          <>
                            {Object.keys(grammarData).map((e, i) => (
                              
                              <Tooltip key={i} label={grammarData[e]["%comment%"]}>
                                <CustomCard
                                  colorScheme={tipcolors[grammarData[e].typeof]}
                                  variant={
                                    grammarData[e].req === "mandatory" ? "solid" : "outline"
                                  }
                                  cursor="pointer"
                                >
                                  {e}: {grammarData[e].typeof}
                                </CustomCard>
                              </Tooltip>
                            ))}
                          </>
                        ) : (
                          <Flex
                            flexDir={"row"}
                            alignItems="center"
                            minH="60vh"
                            justifyContent={"center"}
                            pl="50px"
                          >
                            Please select a grammar file to validate
                          </Flex>
                        )}
                      </Flex> */}

                    <GridItem rowSpan={3} colStart={2} colEnd={5}>
                      <Flex py={4} alignItems={"center"} flexDir="column">
                        {/* <Select
                          placeholder="Select Grammar File"
                          py={4}
                          maxW={80}
                          onChange={onChangeFile}
                          defaultValue={grammarid}
                        >
                          {files.map((file) => (
                            <option key={file._id} value={file._id}>
                              {file.name}
                            </option>
                          ))}
                        </Select> */}
                        <div>
                          <Flex marginBottom={20}>
                            Name:
                            <FormControl
                              paddingRight={10}
                              paddingLeft={2}
                            // value={rulename} onChange={(e) => { setRulename(e) }} placeholder="name"
                            >
                              <input
                                value={rulename}
                                onChange={handel_name}
                                placeholder="  Name"
                              ></input>
                            </FormControl>
                            Description:
                            <FormControl
                              paddingLeft={2}

                            // value={description} onChange={(e) => { set_description(e) }} placeholder="description"
                            >
                              <input
                                value={description}
                                onChange={handel_description}
                                placeholder="  Description"
                              ></input>
                            </FormControl>
                          </Flex>
                        </div>
                        <Flex>
                          <Flex marginRight={10} marginBottom={10}>
                            <AceEditor
                              fontSize={16}
                              showPrintMargin={true}
                              showGutter={true}
                              highlightActiveLine={true}
                              setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                              }}
                              mode="json"
                              theme="terminal"
                              onChange={(newvalue) => {
                                setdata(newvalue);
                                setDownloadable(false);
                                fl = false;
                              }}
                              value={data}
                              name="grammar-editor"
                              wrapEnabled
                              height={"40em"}
                              width={"40em"}
                            />
                          </Flex>

                          <Box
                            as="pane"
                            bg="whitesmoke"
                            _dark={{
                              bg: "gray.800",
                            }}
                          // minH="10vh"
                          >
                            <Box // navbar
                              as="pane"
                              pos="absolute"
                              // top="150"
                              // left="200"
                              zIndex="fixed"
                              h="300px"
                              pb="10"
                              overflowX="hidden"
                              overflowY="auto"
                              bg="grey"
                              borderColor="black"
                              borderRightWidth="1px"
                              w="400px"
                            >
                              <Flex px="4" py="5" align="center">
                                <center>
                                  <Text
                                    fontSize="2xl"
                                    ml="2"
                                    color="white"
                                    fontWeight="semibold"
                                  >
                                    Conditions
                                  </Text>
                                </center>
                              </Flex>

                              <Flex
                                direction="column"
                                as="nav"
                                fontSize="md"
                                color="white"
                                aria-label="Main Navigation"
                                margin={5}
                              >
                                {flag ? (
                                  rules.map((p) => (
                                    <a
                                      onClick={() => {
                                        setdata(data + p);
                                      }}
                                      color="white"
                                    >
                                      {p}
                                    </a>
                                  ))
                                ) : (
                                  <>
                                    <Text>No recent files...</Text>
                                  </>
                                )}
                              </Flex>
                            </Box>
                          </Box>
                        </Flex>

                        <Stack py={4} direction="row">
                          <Button
                            colorScheme="yellow"
                            disabled={!data || !rulename}
                            onClick={() => {
                              handleValidateButton();
                              setSeed(Math.random());
                            }}
                          >
                            Validate
                          </Button>
                          {/* <Button
                            colorScheme="green"
                            disabled={!downloadable}
                            onClick={downloadTxtFile}
                            leftIcon={<BiDownload />}
                          >
                            Download File
                          </Button> */}
                        </Stack>

                        {activeStep === stepslen ? (
                          <Flex
                            px={4}
                            py={4}
                            width="100%"
                            flexDirection="column"
                          >
                            <Heading fontSize="xl" textAlign="center">
                              Woohoo! All steps completed!
                            </Heading>
                            <Button mx="auto" mt={6} size="sm" onClick={reset}>
                              Reset
                            </Button>
                          </Flex>
                        ) : (
                          <Flex width="100%" justify="flex-end">
                            <Button
                              isDisabled={activeStep === 0}
                              mr={4}
                              onClick={prevStep}
                              size="sm"
                              variant={"outline"}
                            >
                              Prev
                            </Button>
                          </Flex>
                        )}
                      </Flex>
                    </GridItem>
                    <GridItem rowSpan={3} colSpan={2} pt={120}>
                      <Flex flexDir={"column"} pl={20}>
                        {displayErrors.length > 0 ? (
                          <List spacing={2}>
                            {displayErrors.map((e, i) => {
                              let str = "";
                              const splitarr = e.match(/(?:[^\s"]+|"[^"]*")+/g);
                              let Val;
                              if (splitarr.length === 12) {
                                splitarr.map(
                                  (m, i) =>
                                    i !== 0 && i !== 10 && (str = str + " " + m)
                                );
                                Val = () => (
                                  <>
                                    <Text as="span">
                                      <Text
                                        as="span"
                                        fontWeight={"bold"}
                                        color={tipcolors[splitarr[10]]}
                                      >
                                        {splitarr[0]}
                                      </Text>
                                      <Text as="span">{str}</Text>
                                      <Text
                                        as="span"
                                        fontWeight={"bold"}
                                        color={tipcolors[splitarr[10]]}
                                      >
                                        {" " + splitarr[10]}
                                      </Text>
                                    </Text>
                                  </>
                                );
                              }

                              if (
                                splitarr.length === 7 ||
                                splitarr.length === 8
                              ) {
                                splitarr.map(
                                  (m, i) => i !== 0 && (str = str + " " + m)
                                );
                                Val = () => (
                                  <>
                                    <Text as="span">
                                      <Text
                                        as="span"
                                        fontWeight={"bold"}
                                        color={"teal.400"}
                                      >
                                        {splitarr[0]}
                                      </Text>
                                      <Text as="span">{str}</Text>
                                    </Text>
                                  </>
                                );
                              }

                              if (splitarr.length === 11) {
                                splitarr.map(
                                  (m, i) =>
                                    i !== 0 && i !== 10 && (str = str + " " + m)
                                );
                                Val = () => (
                                  <>
                                    <Text as="span">
                                      <Text
                                        as="span"
                                        fontWeight={"bold"}
                                        color={tipcolors[splitarr[10]]}
                                      >
                                        {splitarr[0]}
                                      </Text>
                                      <Text as="span">{str}</Text>
                                      <Text
                                        as="span"
                                        fontWeight={"bold"}
                                        color={tipcolors[splitarr[10]]}
                                      >
                                        {" " + splitarr[10]}
                                      </Text>
                                    </Text>
                                  </>
                                );
                              }

                              return (
                                <ListItem key={i}>
                                  <ListIcon
                                    as={FaExclamationCircle}
                                    color="red.500"
                                  />
                                  {<Val />}
                                </ListItem>
                              );
                            })}
                          </List>
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </GridItem>
                  </Grid>
                </p>
              </TabPanel>
              <TabPanel>
                <p>
                  <Grid templateColumns="repeat(6, 1fr)" gap={4} marginTop={20}>
                    <GridItem rowSpan={3} colStart={2} colEnd={5}>
                      <Flex py={4} alignItems={"center"} flexDir="column">

                        <Flex>
                          <Flex marginRight={10} marginBottom={10}>
                            <AceEditor
                              fontSize={16}
                              showPrintMargin={true}
                              showGutter={true}
                              highlightActiveLine={true}
                              setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                              }}
                              mode="json"
                              theme="terminal"
                              value={perdata}
                              name="grammar-editor"
                              wrapEnabled
                              height={"40em"}
                              width={"40em"}
                              readOnly={true}
                            />
                          </Flex>
                          <Box
                            as="pane"
                            bg="whitesmoke"
                            _dark={{
                              bg: "gray.800",
                            }}
                          // minH="10vh"
                          >
                            <Box // navbar
                              as="pane"
                              pos="absolute"
                              // top="250"
                              // right="20"
                              zIndex="fixed"
                              h="300px"
                              pb="10"
                              overflowX="hidden"
                              overflowY="auto"
                              bg="grey"
                              borderColor="black"
                              borderRightWidth="1px"
                              w="400px"
                            >
                              <Flex px="4" py="5" align="center">
                                <center>
                                  <Text
                                    fontSize="2xl"
                                    ml="2"
                                    color="white"
                                    fontWeight="semibold"
                                  >
                                    Conditions
                                  </Text>
                                </center>
                              </Flex>

                              <Flex
                                direction="column"
                                as="nav"
                                fontSize="md"
                                color="white"
                                aria-label="Main Navigation"
                                margin={5}
                              >
                                <>
                                  {valid_rule.length > 0 ? (
                                    valid_rule.map((p) => (
                                      <a
                                        // key={p.rulename}
                                        onClick={() => {
                                          if (perdata.length > 0) {
                                            set_perdata(
                                              perdata +
                                              `,{"rulename":"${p.rulename
                                              }", "description":"${p.description
                                              }","logic": "${btoa(
                                                p.data_name
                                              )}"}\n`
                                            );
                                          } else {
                                            set_perdata(
                                              perdata +
                                              `{"rulename":"${p.rulename
                                              }", "description":"${p.description
                                              }","logic": "${btoa(
                                                p.data_name
                                              )}"}\n`
                                            );
                                          }
                                        }}
                                        color="white"
                                      >
                                        {p.rulename}
                                      </a>

                                      // console.log(p.rulename)
                                    ))
                                  ) : (
                                    // console.log("jjhghguyg")
                                    <>
                                      <Text>No recent files...</Text>
                                    </>

                                  )}

                                </>
                              </Flex>
                            </Box>
                          </Box>
                        </Flex>


                        <Stack py={4} direction="row">
                          <Button
                            // paddingLeft={-2}
                            colorScheme="yellow"
                            onClick={() => {
                              // perdata.slice(0,perdata.length -1)

                              if (!fl) {
                                console.log(typeof rules[0]);
                                for (let i = 0; i < rules.length; i++) {
                                  rules[i] = `"` + rules[i] + `"`;
                                }
                                fl = true;
                              }
                              setdata(
                                `{"objects_used":[${rules}],"rules":[${perdata}]}`
                              );
                              toast({
                                title:
                                  "JSON is validated, click next to continue",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                                position: "top-right",
                              });
                              console.log(data);
                            }}
                            disabled={!perdata}
                            isLoading={submitting}
                          >
                            Validate
                          </Button>

                          <Button
                            onClick={() => {
                              set_perdata("");
                              // fl = false;
                            }}
                            // disabled={!validated || !grammarid}
                            isLoading={submitting}
                            colorScheme="red"
                          // variant={"outline"}
                          >
                            Flush
                          </Button>
                          <Button
                            onClick={() => setSeed(Math.random())}
                            // disabled={!validated || !grammarid}
                            isLoading={submitting}
                            colorScheme="green"
                          // variant={"outline"}
                          >
                            Update
                          </Button>
                          <Button
                            colorScheme="green"
                            disabled={!downloadable}
                            onClick={downloadTxtFile}
                            leftIcon={<BiDownload />}
                          >
                            Download File
                          </Button>
                        </Stack>
                        <Flex width="100%" justify="flex-end">
                          <Button
                            size="sm"
                            onClick={onNextStep}
                            // disabled={!validated || !grammarid}
                            isLoading={submitting}
                            colorScheme="yellow"
                            variant={"outline"}
                          >
                            Next
                          </Button>
                        </Flex>
                      </Flex>
                    </GridItem>
                  </Grid>
                </p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </>
  );
};

const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
  <Box p="1">
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  </Box>
));

export default ProjectPageContent;
