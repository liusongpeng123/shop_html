<template>
  <div>
    <div id="div1">
      <h1>查询信息</h1>
      <el-form :inline="true" :model="brandSearchForm" class="demo-form-inline">
        <el-form-item label="汽车名称">
          <el-input v-model="brandSearchForm.carName" placeholder="汽车名称"></el-input>
        </el-form-item>

        <!-- <el-form-item>
           <el-button type="primary" @click="onSubmit">查询</el-button>
         </el-form-item>-->
        <el-form-item>
          <el-button type="primary" plain @click="toAddBrand">新增</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div id="div2">
      <el-table :data="BrandTableData" style="width: 100%" border>

        <el-table-column
          prop="name"
          label="品牌名称">
        </el-table-column>

        <el-table-column
          prop="bandE"
          label="首字母"
        >
        </el-table-column>

        <el-table-column
          prop="imgpath"
          label="图片">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgpath"/>
          </template>
        </el-table-column>


        <el-table-column
          prop="ord"
          label="排序字段">
        </el-table-column>



        <el-table-column
          prop="createDate"
          label="创建时间">
        </el-table-column>

        <el-table-column
          prop="bandDesc"
          label="品牌介绍">
        </el-table-column>
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

    </div>
    <el-dialog
      title="新增信息" :model="addBrandForm"
      :visible.sync="addFormFlag" width="40%">
      <el-form :model="addBrandForm" ref="addCarForm"   label-width="80px">

        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="addBrandForm.name" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="排序字段" prop="ord">
          <el-input-number v-model="addBrandForm.ord"  :step="1" :min="0" :max="1000"></el-input-number>
        </el-form-item>

        <el-form-item label="首字母" prop="bandE">
          <el-input v-model="addBrandForm.bandE" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="品牌介绍" prop="bandDesc">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addBrandForm.bandDesc">
          </el-input>
        </el-form-item>

        <el-form-item label="图片" prop="imgpath">
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/brand/load"
            :on-success="imgCallBack"
            name="img"
            list-type="picture">
            <el-button plain type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>




      </el-form>
      <el-button @click="addFormFlag = false">取 消</el-button>
      <el-button type="primary" @click="addBrand">确 定</el-button>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:"Brand",
    data(){
      return{
        brandSearchForm:{},
        BrandTableData:[],
        addFormFlag:false,
        addBrandForm:{
          name:"",
          bandE:"",
          imgpath:"",
          bandDesc:"",
          ord:""
        },
    /*    imgpath:"",*/
        /* 分页相关的数据  */
        page:0,
        sizes:[2,3,5,10],
        limit:2,
        length:0
      }
    },methods:{
      queryData(page){
        var tthis=this;
        this.$axios.get("http://localhost:8080/api/brand/queryData?limit="+this.limit+"&page="+page).then(function (rs) {
          /*console.log(rs);*/
          tthis.BrandTableData=rs.data.data;
          tthis.length=rs.data.count;
        }).catch(function () {
          console.log("查询失败");
        })},
      handleCurrentChange(page){
        this.queryData(page);},
      handleSizeChange:function(limit){ //跳转页面
        this.limit=limit;
        this.queryData(1);
      },
      imgCallBack:function(response, file, fileList){ //图片上传的回调函数
        // 赋值
        this.addBrandForm.imgpath=response.data;
      },
      toAddBrand(){
        this.addBrandForm={};
        this.addFormFlag=true;
      },addBrand(){
        /*console.log(this.addForm);*/
        /* debugger;*/
        if (this.addBrandForm.id!=null) {
          this.$axios.post("http://localhost:8080/api/brand/update",this.$qs.stringify(this.addBrandForm)).then(rs=>{
            this.addFormFlag = false;
            this.queryData(1);
            this.addBrandForm.imgpath="";
          }).catch(error=>{
            console.log("修改失败")
          })
        }
        else {
         /* debugger;*/
          this.$axios.post("http://localhost:8080/api/brand/add",this.$qs.stringify(this.addBrandForm)).then(rs=>{
            this.addFormFlag = false;
            this.queryData(1)
          }).catch(err=>console.log("新增失败"))
        }
      },toUpdate(id){
       /* this.addBrandForm.imgpath="";*/
        this.updateFormFlag=true;
        var tthis=this;
        this.$axios.post("http://localhost:8080/api/brand/queryById?id="+id).then(rs=>{
          this.addFormFlag=true;
          this.addBrandForm=rs.data.data;
          this.queryData(1);
        }).catch(function () {
          console.log("查询异常");
        })
      }
    },created(page){
      this.queryData(1);
    }
  }
</script>

<style scoped>

</style>
