<template>
    <div>
      <el-button type="success" plain @click="toAddPeoperty">新增</el-button>
     <!-- 属性的表格信息展示-->
      <el-table :data="peopertyTableData" style="width: 100%" border>

          <el-table-column align="center"
            prop="id"
            label="序号">
          </el-table-column>

          <el-table-column align="center"
            prop="peopertyId"
            label="属性id">
          </el-table-column>

          <el-table-column align="center"
            prop="peopertyName"
            label="属性值">
          </el-table-column>

          <el-table-column align="center"
            prop="isSku"
            label="是否是sku属性"
            :formatter="isSku">
          </el-table-column>

          <el-table-column align="center"
            prop="peopertyType"
            label="属性的类型"
            :formatter="changetypeId">
          </el-table-column>

          <el-table-column align="center"
            prop="typeId"
            label="类型"
            :formatter="changetype">
          </el-table-column>
          <el-table-column label="操作" align="center" width="230">
            <template slot-scope="scope">
              <el-button type="danger" plain
                @click="toUpdate(scope.row.id)">修改</el-button>
              <el-button type="warning" plain
                @click="handleDelete( scope.row.id)">删除</el-button>
              <el-button v-if="scope.row.peopertyType!=3" type="success" plain
                @click="peopertyValue( scope.row)">属性值</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!--分页-->
      <el-pagination align="center"

          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="sizes"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="length">

        </el-pagination>
      <!--新增及修改模板-->
      <el-dialog title="属性的信息" :visible.sync="addFormFlag">
        <el-form :model="addForm" ref="addForm"   label-width="100px">

          <el-form-item label="属性英文名" prop="peopertyId">
            <el-input v-model="addForm.peopertyId" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="属性中文名" prop="peopertyName">
            <el-input v-model="addForm.peopertyName" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="商品类型" prop="typeId">
            <el-select v-model="addForm.typeId" placeholder="请选择分类">
             <!-- <el-option label="请选择" :value="-1"></el-option>-->
              <el-option v-for="item in TypeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="属性类型" prop="peopertyType">
            <el-radio v-model="addForm.peopertyType" :label="0">下拉框</el-radio>
            <el-radio v-model="addForm.peopertyType" :label="1">单选框</el-radio>
            <el-radio v-model="addForm.peopertyType" :label="2">复选框</el-radio>
            <el-radio v-model="addForm.peopertyType" :label="3">输入框</el-radio>
          </el-form-item>

          <el-form-item label="是否为Sku" prop="isSku">
            <el-radio v-model="addForm.isSku" :label="0">是</el-radio>
            <el-radio v-model="addForm.isSku" :label="1">否</el-radio>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addPeoperty">确 定</el-button>
        </div>
      </el-dialog>
      <!--属性值表格信息展示模板-->
      <el-dialog :title="valueTitle" :visible.sync="peopertyValueFlag">
        <el-button type="success" plain @click="toAddPeopertyValue">新增</el-button>
        <el-table :data="peopertyValueData" style="width: 100%" border>
          <el-table-column
            prop="id"
            label="属性值id">
          </el-table-column>

          <el-table-column
            prop="name"
            label="属性值英文名">
          </el-table-column>

          <el-table-column
            prop="nameCh"
            label="属性值中文名"
          >
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" plain
                @click="toUpdatePeopertyValue(scope.row.id)">修改</el-button>
              <el-button
                type="warning" plain
                @click="deletePeopertyValue( scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--新增属性值修改模板-->
      <el-dialog title="属性值信息" :visible.sync="addPeopertyValueFormFlag">
        <el-form :model="addPeopertyValueForm" ref="addPeopertyValueForm" :rules="rules"  label-width="100px">
         <!-- <el-form-item label="属性英文名" prop="id">
            <el-input v-model="addPeopertyValueForm.id"  autocomplete="off" ></el-input>
          </el-form-item>-->
          <el-form-item label="属性英文名" prop="name">
            <el-input v-model="addPeopertyValueForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="属性中文名" prop="nameCh">
            <el-input v-model="addPeopertyValueForm.nameCh" autocomplete="off" ></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addPeopertyValue">确 定</el-button>
        </div>
      </el-dialog>
      </div>

</template>

<script>
    export default {
        name: "Peoperty",

        data(){
          //属性值的中文验证
          let checkChname = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('属性名不能为空'));
            }
            if(/^[\u4e00-\u9fa50-9a-z]+$/i.test(value)){
              callback();
            }else{
              callback(new Error('只能输入中文,字母,数字'));
            }
          };
          //属性值的英文验证
          let checkName = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('属性名不能为空'));
            }
            if(/^[a-z0-9]+$/i.test(value)){
              callback();
            }else{
              callback(new Error('只能输入英文字母,数字'));
            }
          };
          return{
            //属性表格的字段
            peopertyTableData:[],
            //属性的弹框状态设置为关闭
            addFormFlag:false,
            //类型
            TypeDatas:[],
            TypeData:[
          /* {"id":7,name:"分类/电子产品/手机"},
             {"id":9,name:"分类/电子产品/笔记本"},
             {"id":8,name:"分类/服装/上衣"},
             {"id":10,name:"分类/服装/裤子"},
             {"id":11,name:"分类/家电/空调"},
             {"id":12,name:"分类/家电/洗衣机"},
             {"id":13,name:"分类/家电/冰箱"}*/
            ],typeName:"",
            //属性的新增表单需要的字段
            addForm:{
            },
            //属性值表格的字段
            peopertyValueData:[],
           /* peoId:"",*/
            //新增属性值的表单需要的字段
            addPeopertyValueForm:{
            },
            //新增属性值的状态默认设置为关闭
            addPeopertyValueFormFlag:false,
            //属性值的弹框状态设置为关闭
            peopertyValueFlag:false,
            //属性的分页需要的字段
            page:0,
            sizes:[2,3,5,10],
            limit:2,
            length:0,
            //分类的父类
            parentData:{},
            valueTitle:"",
            rules:{
              nameCh:[
                { required: true, message: '请输入属性值中文名称', trigger: 'blur' },
                {  max: 10, message: '长度不超过10 个字符', trigger: 'blur' },
                { validator:checkChname,trigger: 'blur' }
              ],
              name:[
                { required: true, message: '请输入属性值英文名称', trigger: 'blur' },
                {  max: 10, message: '长度不超过10 个字符', trigger: 'blur' },
                { validator:checkName,trigger: 'blur' }
              ]

            }
          }
        },methods:{
        //查询属性的分页
        queryData(page){
          var tthis=this;
          this.$axios.get("http://localhost:8080/api/peoperty/queryPeopertyData?limit="+this.limit+"&page="+page).then(function (rs) {
            tthis.peopertyTableData=rs.data.data;
            tthis.length=rs.data.count;
          }).catch(function () {
            console.log("查询分页失败")
          })
        },
        //分页中的左右键页数改变
        handleCurrentChange(page){
          this.queryData(page);
        },
        //属性的页数下一页改变
        handleSizeChange:function(limit){ //跳转页面 页数改变
          this.limit=limit;
          this.queryData(1);
        },
        //属性的逻辑删除
        handleDelete(id){
          this.$axios.post("http://localhost:8080/api/peoperty/delete?id="+id).then(rs=>{
            this. queryData(1);
          }).catch(err=>{
            console.log("删除失败")})
        },
        //跳转属性的修改页面
        toUpdate(id){
              this.$axios.get("http://localhost:8080/api/peoperty/queryPeopertyById?id="+id).then(rs=>{
              /*  console.log(this.id);*/
                //打开弹框
                this.addFormFlag=true;
                //赋值，重新查询
                this.addForm=rs.data.data;
                this.queryData(1);
              }).catch(err=>{
                console.log("查看修改页面失败")
              })
        },
        //类型
        changetypeId(row, column){
        for (let i = 0; i <this.TypeData.length ; i++) {
          if (row.typeId==this.TypeData[i].id){
            return this.TypeData[i].name
          }
        }
        return "未知"
      },
        //属性的新增及修改提交
        addPeoperty(){
          //如果有id说明是修改
          if (this.addForm.id!=null) {
              this.$axios.post("http://localhost:8080/api/peoperty/updatePeoperty",this.$qs.stringify(this.addForm)).then(rs=>{
                //关闭弹框，重新查询
                this.addFormFlag = false;
                this.queryData(1);
              }).catch(error=>{
                  console.log("修改失败")
              })
          }
          //如果没有id说明是新增
          else {
            this.$axios.post("http://localhost:8080/api/peoperty/addPeoperty",this.$qs.stringify(this.addForm)).then(rs=>{
              this.addFormFlag = false;
              this.queryData(1)
            }).catch(err=>console.log("新增失败"))
          }
        },
        //属性类型的初始化
        changetype:function (row, column) {
        return row.peopertyType==0?"下拉框":row.peopertyType==1?"单选框":row.peopertyType==2?"复选框":row.peopertyType==3?"输入框":"未知"
      },
        //是否是sku
        isSku:function (row, column) {
          return row.isSku==0?"是":"不是";
        },
        //属性的跳转页面
        toAddPeoperty(){
          //清空
          this.addForm={};
          //打开弹框
          this.addFormFlag=true;

        },
        //获得类型
        getTypeData(){
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
            //定义的数据     TypeDatas 等于查询出来的所有数据
            this.TypeDatas=rs.data.data;
            //查看有没有子节点数据
            this.getChildrenType();
            for (let i = 0; i <this.TypeData.length ; i++) {
              this.typeName="";
              this.diGui(this.TypeData[i]);
              //给name重新赋值
              this.TypeData[i].name=this.typeName.split("/").reverse().join("/").substr(0,this.typeName.length-1);

            }
          }).catch(err=>{
            console.log("查询类型失败")})
        },diGui(node){
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.TypeDatas.length ; i++) {
              if(node.pid==this.TypeDatas[i].id){
                this.diGui(this.TypeDatas[i]);
                break;
              }
            }

          }else{
            this.typeName+="/"+node.name;
          }
        },
        getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.TypeDatas.length ; i++) {
            //节点中所有数据的一条
            let  node=this.TypeDatas[i];
            //判断有没有子节点
            this.isChildrenNode(node);
          }
        },isChildrenNode:function(node){
          let rs=true; //标示
          for (let i = 0; i <this.TypeDatas.length ; i++) {
            //如果数据的id有指向所有数据的pid 证明是下面还有节点的
            if(node.id==this.TypeDatas[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            //将数据放到表中需要的字段中
            this.TypeData.push(node);
          }
        },
        //属性值的弹框
        peopertyValue(row){
          this.peopertyValueFlag=true;
          this.valueTitle=row.peopertyName+"的选项信息";
          this.addPeopertyValueForm.peoId=row.id;
          this.queryPeopertyValueTableData(row.id);

        },
        queryPeopertyValueTableData(peoId){
          this.$axios.get("http://localhost:8080/api/peopertyValue/queryByPeoId?peoId="+peoId).then(rs=>{
            console.log(rs.data);
            this.peopertyValueData=rs.data;
          }).catch(err=>{console.log("查询失败")})
        },
        //属性值的删除
        deletePeopertyValue(id){
          this.$axios.post("http://localhost:8080/api/peopertyValue/deletePeopertyValue?id="+id).then(rs=>{
            this. queryData(1);
           /* this.peopertyValue(this.id);*/
          }).catch(err=>console.log("删除失败"))
        },
        //跳转属性值的修改页面
        toUpdatePeopertyValue(id){
          this.$axios.get("http://localhost:8080/api/peopertyValue/quertyPeopertyValueById?id="+id).then(rs=>{
            /*  console.log(this.id);*/
            //打开弹框
            this.addPeopertyValueFormFlag=true;
            //赋值
            this.addPeopertyValueForm=rs.data.data;
            //重新查询
            this.queryData(1);
          }).catch(err=>{
            console.log("查看修改页面失败")
          })
        },
        //跳转属性值的新增页面
        toAddPeopertyValue(){
       /*   debugger;*/
          //清空里面的值
           /*this.addPeopertyValueForm={};*/
          this.addPeopertyValueFormFlag=true;
    },
        //属性值修改和新增的提交
        addPeopertyValue(){
           /*debugger;*/




          //如果有id 证明是修改
          if (this.addPeopertyValueForm.id!=null) {

            this.$refs["addPeopertyValueForm"].validate((valid) => {
              if (valid) {
                this.$axios.post("http://localhost:8080/api/peopertyValue/updatePeopertyValue",this.$qs.stringify(this.addPeopertyValueForm)).then(rs=>{
                  //关闭弹框，重新查询
                  this.addPeopertyValueFormFlag = false;
                  this.queryData(1);
                }).catch(error=>{
                  console.log("修改失败")
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });

          }
          else {
            debugger;
            //如果没有id 证明是新增
            this.$axios.post("http://localhost:8080/api/peopertyValue/addPeopertyValue",this.$qs.stringify(this.addPeopertyValueForm)).then(rs=>{
              //关闭弹框，重新查询
              this.addPeopertyValueFormFlag = false;
              this.queryData(1)
            }).catch(err=>console.log("新增失败"))
          }
        }
      },
      created(page){
        this. queryData(1);
        //属性的下拉框
        this.getTypeData();

      }
    }
</script>

<style scoped>

</style>
