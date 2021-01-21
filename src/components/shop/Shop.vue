<template>
    <div>
      <el-table :data="tableData" style="width: 100%"  border >

        <el-table-column label="商品ID" prop="id"  align="center">
        </el-table-column>

        <el-table-column label="商品名称" prop="name"  align="center">
        </el-table-column>

        <el-table-column label="标题" prop="title"  align="center">
        </el-table-column>

        <el-table-column label="商品介绍" prop="productdecs"  align="center">
        </el-table-column>

        <el-table-column label="分类" prop="peopertyId"  align="center">
        </el-table-column>

        <el-table-column label="品牌" prop="brandId"  align="center">
        </el-table-column>

        <el-table-column align="center"
          prop="imgpath"
          label="图片">
          <template slot-scope="scope">
            <img width="50px" :src="scope.row.imgpath"/>
          </template>
        </el-table-column>

        <el-table-column label="价格" prop="price"  align="center">
        </el-table-column>

        <el-table-column label="库存" prop="stocks"  align="center">
        </el-table-column>

        <el-table-column label="排序字段" prop="sortNum"  align="center">
        </el-table-column>

        <el-table-column label="操作" align="center" width="240px">
          <template slot-scope="scope" >
            <el-button type="info" plain
              @click="toUpdate(scope.row.id)">修改</el-button>
            <el-button
              type="warning" plain
              @click="handleDelete( scope.row.id)">删除</el-button>
            <el-button type="success" plain
                       @click="handleEdit(scope.row.id)">编辑</el-button>

          </template>
        </el-table-column>


      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="sizes"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="length">
      </el-pagination>
      <el-dialog
        title="修改商品属性信息" :model="updatePeopertyForm"
        :visible.sync="updatePeopertyFormFlag" width="40%">
      </el-dialog>

      <el-dialog
        title="修改商品信息" :model="updateShopForm"
        :visible.sync="updateFormFlag" width="40%">
        <el-form :model="updateShopForm" ref="addCarForm"   label-width="80px">

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="updateShopForm.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="商品标题" prop="title">
            <el-input v-model="updateShopForm.title" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="updateShopForm.brandId" placeholder="请选择分类">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品类型" prop="peopertyId">
            <el-select v-model="updateShopForm.peopertyId" placeholder="请选择分类">
              <!-- <el-option label="请选择" :value="-1"></el-option>-->
              <el-option v-for="item in TypeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序字段" prop="sortNum">
            <el-input-number v-model="updateShopForm.sortNum"  ></el-input-number>
          </el-form-item>

          <el-form-item label="价格" prop="price">
            <el-input-number v-model="updateShopForm.price"  ></el-input-number>
          </el-form-item>

          <el-form-item label="库存" prop="stocks">
            <el-input-number v-model="updateShopForm.stocks"  :step="1" :min="0" :max="1000"></el-input-number>
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
          <el-form-item label="商品介绍" prop="productdecs">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="updateShopForm.productdecs">
            </el-input>
          </el-form-item>

        </el-form>
        <el-button @click="updateFormFlag = false">取 消</el-button>
        <el-button type="primary" @click="updateShop">确 定</el-button>
      </el-dialog>


    </div>
</template>
<style scoped>

</style>
<script>
    export default {
        name: "Shop",
        data(){
          return{
            tableData:[],//表格的数据
            page:0,
            sizes:[2,3,5,10],
            limit:2,
            length:0,//分页的数据
            updateShopForm:{},//修改商品弹框的值
            brandData:[],//商品的品牌下拉框
            TypeData:[],//商品的类型下拉框
            updateFormFlag:false,//修改商品信息的弹框
            updatePeopertyFormFlag:false,//修改商品属性的弹框
            updatePeopertyForm:{},//修改商品属性的值
          }
        },methods:{
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          // 赋值
          this.updateShopForm.imgpath=response.data;
        },
        handleCurrentChange(page){
          this.queryData(page);},
        handleSizeChange:function(limit){ //跳转页面
          this.limit=limit;
          this.queryData(1);
        },
        toUpdate(id){
          this.brandData=[];
          this.TypeData=[];
          this.updateFormFlag=true;
          this.$axios.get("http://localhost:8080/api/shop/quertyShopById?id="+id).then(rs=>{
            this.updateShopForm=rs.data;
            this.getTypeData();
            this.getBrandData();
          }).catch(err=>console.log("修改异常"))
        },
        updateShop(){
          this.$axios.post("http://localhost:8080/api/shop/updateShop",this.$qs.stringify(this.updateShopForm)).then(rs=>{
            //关闭弹框，重新查询
            this.updateFormFlag = false;
            this.queryData(1);
          }).catch(error=>{
            console.log("修改失败")
          })
        },
        handleDelete(id){
          this.$axios.post("http://localhost:8080/api/shop/deleteShop?id="+id).then(rs=>{
            this. queryData(1);
          }).catch(err=>{
            console.log("删除失败")})
        },
        getBrandData(){
          this.$axios.get("http://localhost:8080/api/brand/queryAllBrandData").then(rs=>{
            this.brandData=rs.data;
          }).catch(err=>{console.log("查询品牌信息失败")});
        },//查询品牌的下拉框
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
      },//查询类型的下拉框
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
        queryData(page){
          this.$axios.get("http://localhost:8080/api/shop/quertyShopData?limit="+this.limit+"&page="+page).then(rs=>{
            this.tableData=rs.data.data;
            this.length=rs.data.count;
          }).catch(err=>console.log("加载商品列表失败"))
        },
       /* handleEdit(id){

        }*/
      },
      created(){
          this.queryData(1);
      }
    }
</script>


