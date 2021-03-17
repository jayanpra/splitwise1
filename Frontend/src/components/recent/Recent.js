import React from 'react'

const Recent = () => {
    return (
        <div>
            <AddExpense open={expTog} onToggle={showAddExpense}/>
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: 0, left:0, height: "1000px" }}>
            <Row><MDBContainer>
                <p>.</p>
                <p className="ml-5 ml-lg-0">.</p>
            </MDBContainer></Row>
            <Row>
                <Col sm={2}>
                    <GroupSide groupname={data.group_name} launchExpense={showAddExpense} changeGroup={changeGroup}/>
                </Col>
                <Col sm={7}>
                    <GroupBody name={data.name} expense_list={data.selected_group}/>
                </Col>
                <Col sm={3}>
                    <Row>
                        {show_req ? group_req.map((req) => <MDBContainer>
                            <MDBCard><MDBCardBody>{req}
                                    <FaCheck onClick={() => groupApprove(req)} style={{color: 'green', cursor: 'pointer'}}/>
                                </MDBCardBody></MDBCard>
                            </MDBContainer>)
                        : null}
                        {show_req ? <MDBBtn onClick={showRequest} color="warning">Collapse</MDBBtn> :
                        <MDBBtn onClick={showRequest} color="warning">Show Group Request</MDBBtn>}
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Recent
