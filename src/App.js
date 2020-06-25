import React, { useState, useEffect } from "react";
import axios from "axios";
const api_link = "https://www.nabilfarragschool.com/trufla/api/public/api";

function App() {
  const [data, setData] = useState({ hits: [] });
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(api_link + "/filter");
      setData(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const result = await axios(api_link + "/departments");
      setDepartments(result.data);
    };
    fetchDepartments();
  }, []);

  function NameComponent() {
    async function handleName(e) {
      await setName(e);
      const fetchData = async () => {
        const result = await axios(
          `${api_link}/filter?page=1&department=${department}&code=${code}&name=${e}`
        );
        setData(result.data);
      };
      await fetchData();
      document.getElementById("name").focus();
    }

    return (
      <div className="input-group   col-4">
        <input
          className="form-control"
          placeholder="Name"
          aria-label="name"
          id="name"
          onChange={(e) => handleName(e.target.value)}
          value={name}
        />
      </div>
    );
  }

  function CodeComponent() {
    async function handleCode(e) {
      await setCode(e);
      const fetchData = async () => {
        const result = await axios(
          `${api_link}/filter?page=1&department=${department}&code=${e}&name=${name}`
        );

        setData(result.data);
      };
      await fetchData();
      document.getElementById("code").focus();
    }

    return (
      <div className="input-group   col-4">
        <input
          className="form-control"
          placeholder="Code"
          aria-label="code"
          id="code"
          onChange={(e) => handleCode(e.target.value)}
          value={code}
        />
      </div>
    );
  }

  function DepartmentsComponent() {
    async function handleDepartment(e) {
      await setDepartment(parseInt(e));
      const fetchData = async () => {
        const result = await axios(
          `${api_link}/filter?page=1&department=${e}&code=${code}&name=${name}`
        );
        setData(result.data);
      };
      fetchData();
    }
    if (departments) {
      return (
        <div className="input-group   col-4">
          <select
            defaultValue={department} 
            className="form-control"
            name="Department"
            data-width="100%"
            id="Department"
            onChange={(e) => handleDepartment(e.target.value)}
          >
            <option    value={0}>All Departments</option>
            {departments.map((item ,x) => (
              <option  key={x} value={item.id} >
                {item.name}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      return "...";
    }
  }

  function BodyComponent() {
    let itemsToRender;
    if (data.data) {
      return (
        <div className="App row  col-12">
          <table className="table table-striped">
            <thead>
              {data.data.length > 0 ? (
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Promotion </th>
                  <th scope="col">Code</th>
                </tr>
              ) : (
                ""
              )}
            </thead>

            <tbody>
              {data.data.map((item,x) => (
                <tr key={x}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.discount} </td>
                  <td>{item.code} </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h6>
            {data.data.length > 0 ? (
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  {[...Array(data.last_page)].map((x, i) => (
                    <li key={i}
                      className={
                        "page-item " +
                        (i + 1 == data.current_page ? "active" : "")
                      }
                    >
                      <a
                        className="page-link"
                        onClick={() => pagination(i + 1)}
                      >
                        {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              "No data available"
            )}
            <br />
          </h6>

          {/* {JSON.stringify(data.data)} */}
        </div>
      );
    } else {
      itemsToRender = "Loading...";
    }

    return <div> {itemsToRender}</div>;
    function pagination(num) {
      const fetchData = async () => {
        const result = await axios(
          `${api_link}/filter?page=${num}&department=${department}&code=${code}&name=${name}`
        );
        setData(result.data);
      };
      fetchData();
    }
  }

  return (
    <>
      <div className="shadow container ">
        <div className="row  col-12">
          <DepartmentsComponent />
          <NameComponent />
          <CodeComponent />
          <BodyComponent />
        </div>
      </div>
    </>
  );
}

export default App;
