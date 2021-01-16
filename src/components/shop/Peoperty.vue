<template>
    <div>

      <el-button type="success" plain @click="toAddPeoperty">新增</el-button>


        <el-table :data="peopertyTableData" style="width: 100%" border>

          <el-table-column
            prop="id"
            label="序号">
          </el-table-column>

          <el-table-column
            prop="peopertyId"
            label="属性id">
          </el-table-column>

          <el-table-column
            prop="peopertyName"
            label="属性值">
          </el-table-column>


          <el-table-column
            prop="isSku"
            label="是否是sku属性">
          </el-table-column>

          <el-table-column
            prop="peopertyType"
            label="属性的类型"
            :formatter="changetypeId">
          </el-table-column>

          <el-table-column
            prop="typeId"
            label="类型"
            :formatter="changetype">
          </el-table-column>
          <!--<el-table-column
            prop="imgPath"
            label="图片">
            <template slot-scope="scope">
              <img width="50px" :src="'http://'+scope.row.imgPath"/>
            </template>
          </el-table-column>-->




         <!-- <el-table-column
            prop="bandDesc"
            label="品牌介绍">
          </el-table-column>-->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" plain
                         @click="toUpdate(scope.row.id)">修改</el-button>
              <el-button
                type="warning" plain
                @click="handleDelete( scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination

          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="sizes"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="length">

        </el-pagination>
      <!--新增模板-->
      <el-dialog title="品牌信息" :visible.sync="addFormFlag">

        <el-form :model="addForm" ref="addForm"   label-width="100px">

          <el-form-item label="属性英文名" prop="peopertyId">
            <el-input v-model="addForm.peopertyId" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="属性中文名" prop="peopertyName">
            <el-input v-model="addForm.peopertyName" autocomplete="off" ></el-input>
          </el-form-item>



          <el-form-item label="商品类型" prop="typeId">
            <el-select v-model="addForm.typeId" placeholder="请选择">
              <el-option
                v-for="item in TypeDatas"
                :key="item.id"
                :label="item.name"
                :value="item.id">
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
         <!-- <el-button type="primary" @click="addShopData">确 定</el-button>-->
        </div>
      </el-dialog>

      </div>

</template>

<script>
    export default {
        name: "Peoperty",
        data(){
          return{
            peopertyTableData:[],
            addFormFlag:false,
            TypeDatas:[],
            TypeData:[],

            addForm:{
              id:"",
              peopertyId:"",
              peopertyName:"",
              typeId:"",
              peopertyType:"",
              isSku:"",
            },
           page:0,
             sizes:[2,3,5,10],
            limit:2,
            length:0
          }
        },methods:{
        queryData(page){
          var tthis=this;
          this.$axios.get("http://localhost:8080/api/peoperty/queryPeopertyData?limit="+this.limit+"&page="+page).then(function (rs) {
            tthis.peopertyTableData=rs.data.data;
            tthis.length=rs.data.count;
          }).catch(function () {
            console.log("查询分页失败")
          })
        },
        handleCurrentChange(page){
          this.queryData(page);
        },
        handleSizeChange:function(limit){ //跳转页面
          this.limit=limit;
          this.queryData(1);
        },
        handleDelete(id){
          this.$axios.post("http://localhost:8080/api/peoperty/delete").then(rs=>{
            this. queryData(1);
          }).catch(err=>{console.log("删除失败")})
        },
        toUpdate(id){
              this.$axios.post("http://localhost:8080/api/peoperty/updateById?id="+id).then(rs=>{
                this.addForm=rs.data.data;
                this.queryData(1);
              }).catch(err=>{
                console.log("查看修改页面失败")
              });
          this.addFormFlag=true;
        },
        changetypeId(row, column){
        for (let i = 0; i <this.TypeData.length ; i++) {
          if (row.typeId==this.TypeData[i].id){
            return this.TypeData[i].name
          }
        }
        return "未知"
      },
        changetype:function (row, column) {
        return row.peopertyType==0?"下拉框":row.peopertyType==1?"单选框":row.peopertyType==2?"复选框":"输入框"
      },
        toAddPeoperty(){
          this.addForm={};
          this.addFormFlag=true;
        },
        getTypeData(){
          this.$axios.get("http://localhost:8080/api/type/getData").then(rs=>{
            console.log(rs);
            this.TypeData=rs.data.data;
            this.getTypeDatas();
          }).catch(err=>{
            console.log("查询类型失败")})
        },getTypeDatas(){
          for (let i = 0; i <this.TypeData.length ; i++) {
            var rs=this.isParent(this.TypeData[i]);
            if(rs==false){
                this.TypeDatas.push(this.TypeData[i]);
              console.log(this.TypeData[i]);
            }
          }
        },isParent(datas){
          for (let i = 0; i <this.TypeData ; i++) {
            if(datas.id==this.TypeData[i].pid){
                return true;
            }
          }
          return false;
        }

      },
      created(page){
        this. queryData(1);
        this.getTypeData();
      }
    }
</script>

<style scoped>

</style>
