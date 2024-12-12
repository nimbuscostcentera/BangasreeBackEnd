const { sq } = require("../../config/ormdb");
const { v4: uuidv4 } = require("uuid");
const { sequelize, DataTypes, TimeoutError } = require("sequelize");
const date = new Date();
const CustomerMasters = sq.define("CustomerMasters", {
    customerID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement:true,
    allowNull:false
  },
  UUid:{
     type:DataTypes.BIGINT,
     unique: true,
     allowNull: false
  },
  CompanyCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references:{
    model:'CompanyMasters',
    key:"CompanyCode"
    }
    },
    AgentCode: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
        model:'AgentMasters',
        key:"AgentCode"
    }
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
    },
      Gurdian: {
    type: DataTypes.STRING,
    allowNull:false
  },
  Address: {
    type: DataTypes.STRING,
    allowNull:false
    },
    LocalBody: {
    type: DataTypes.STRING,
    allowNull:false
  },
  Phonenumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EmailId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    AlternateNo: {
    type: DataTypes.STRING
  },
    DOB:{
    type:DataTypes.DATEONLY,
    allowNull:false
    }, 
    Occupation:{
    type:DataTypes.STRING,
    allowNull:false
    },     
    Nomineename:{
      type: DataTypes.STRING,
    }, 
      Relation:{
      type: DataTypes.STRING,
    },  
 
      Sex:{
          type: DataTypes.STRING,
          allowNull:false
    },  
      IdProofType:{
          type: DataTypes.STRING,
          allowNull:false
    },  
           IdProofPhoto:{
          type: DataTypes.STRING,
          allowNull:false
    }, 
          NomineeIdProofType:{
          type: DataTypes.STRING,
          allowNull:false
    },  
        NomineeIdProofPhoto:{
          type: DataTypes.STRING,
          allowNull:false
    },        
      Photo:{
          type: DataTypes.STRING,
          allowNull:false
    },  
      NomineePhoto:{
          type: DataTypes.STRING
    },      
      Customersignature:{
          type: DataTypes.STRING,
          allowNull:false
    },  
      password:{
          type: DataTypes.STRING,
          allowNull:false
  },      
  Status: {
    type: DataTypes.BOOLEAN,
  }
});
sq.sync().then(() => {
  console.log("Table created successfully!");
});
module.exports={CustomerMasters};
// const su1 = SuperUserMasters.create({
//   UUid:uuidv4(),
//   CompanyCode:"BGPL",
//   Name: "Debolina Halder",
//   Password:"abc@123",
//   DID:1,
//   PhoneNumber:"6546544654",
//   EmailId:"debolina@gmail.com",
//   RegistrationDate:date,
//   Photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqaOWaydrrJYTbm0OELlbHzzVB8vNTh6BNKbGk5GFSsjEVxBLY_BzR4Hzgs-kBbeQfBE&usqp=CAU",
//   Status:true,
// })
