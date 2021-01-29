<template>
  <div class="body">

    <div class="tbody">
      <el-steps :active="active" finish-status="success">
        <el-step title="商品信息"></el-step>
        <el-step title="属性信息"></el-step>

      </el-steps>
      <!-- 个人信息 -->
      <div class="info" v-if="active==1">
        <el-form ref="shopAdd" :model="shopAdd" label-width="80px">

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="shopAdd.name" style="width: 200px"></el-input>
          </el-form-item>

          <el-form-item label="商品标题" prop="title">
            <el-input v-model="shopAdd.title" style="width: 500px" maxlength="30" show-word-limit></el-input>
          </el-form-item>

          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="shopAdd.brandId" placeholder="请选择分类">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in BrandData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品介绍" prop="textarea">
            <el-input type="textarea" style="width: 200px"  v-model="shopAdd.productdecs" maxlength="50" show-word-limit></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="shopAdd.price" :precision="2" :step="0.1" style="width: 200px"></el-input-number>
          </el-form-item>

          <el-form-item label="商品库存" prop="stocks">
            <el-input-number v-model="shopAdd.stocks" :step="10" style="width: 200px"></el-input-number>
          </el-form-item>

          <el-form-item label="排序字段" prop="sortNum">
            <el-input-number v-model="shopAdd.sortNum" :step="1" style="width: 200px"></el-input-number>
          </el-form-item>
          <!-- 图片插件  -->
          <el-form-item label="图片" prop="imgpath">
            <el-upload
              class="upload-demo"
              action="http://localhost:8080/api/brand/load"
              :on-success="imgCallBack"
              name="img"
              list-type="picture" style="width: 260px">
              <el-button plain type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="info" v-if="active==2">
        <el-form ref="peopertyAdd" :model="peopertyAdd" label-width="80px" >
          <el-form-item label="商品类型" prop="typeId">
            <el-select v-model="peopertyAdd.typeId" placeholder="请选择分类" @change="selectChange">
              <el-option v-for="item in TypeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-model="peopertyAdd.peopertyId" v-if="skuData.length>0" label="商品sku" prop="peopertyId">

            <el-form-item v-for="a in  skuData" :key="a.id" :label="a.peopertyName">
              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-checkbox-group  v-if="a.peopertyType==2" v-model="a.ckValues" @change="skuChange">
                <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" ></el-checkbox>
              </el-checkbox-group>

            </el-form-item>


          </el-form-item>

          <el-table
            v-if="tableShow"
            :data="tableSkuData"
            style="width: 100%" >
            <!--   动态展示列头  sku属性中文名 -->
            <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
            </el-table-column>

            <el-table-column
              label="库存"
              width="180">

              <template slot-scope="scope">
                <el-input v-model="scope.row.kuCun"/>
              </template>

            </el-table-column>
            <el-table-column
              label="价格"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jiaGe"/>
              </template>
            </el-table-column>
          </el-table>




          <el-form-item  v-if="notSkuData.length>0" label="商品属性" prop="peopertyId">

            <el-form-item v-for="a in  notSkuData" :key="a.id" :label="a.peopertyName">
              <template slot-scope="scope">
              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-select v-if="a.peopertyType==0" v-model="a.ckValues" placeholder="请选择">
                <el-option v-for="item in a.values" :key="item.id"  :label="a.ckValues" :value="item.nameCh"></el-option>
              </el-select>

              <el-radio-group  v-if="a.peopertyType==1" v-model="a.ckValues">
                <el-radio v-for="item in a.values" :key="item.id" :label="item.nameCh"></el-radio>
              </el-radio-group>

              <el-checkbox-group  v-if="a.peopertyType==2"  v-model="a.ckValues" >
                <el-checkbox v-for="item in a.values" :key="item.id" :label="item.nameCh" name="type"></el-checkbox>
              </el-checkbox-group>
            <!--  @change="notSkuChange"-->
              <el-input v-if="a.peopertyType==3" v-model="a.ckValues"></el-input>
              </template>
            </el-form-item>
          </el-form-item>
          <el-button type="primary" @click="addProduct">添加</el-button>
        </el-form>

        <div>
        </div>
      </div>
      <div class="info" v-if="active==3">
        商品提交
      </div>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <el-button style="margin-top: 12px;" @click="pre" v-if="active>1">上一步</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name:"ShopAdd",
    data() {
      return {
        active: 1,
        shopAdd:{},
        BrandData:{},//品牌
        TypeData:[],//所有分类的每个类型
        TypeDatas:[],//所有分类的类型
        peopertyAdd:{},//商品类型
        peopertyData:[],//通过id查询下拉框所有的属性
        skuData:[],//sku属性
        notSkuData:[],//非sku属性
        tableShow:false,
        tableSkuData:[],//动态表头对应的表格数据
        cols:[],//动态表头
        sk:{},//非sku 选中的值
        kuCun:"",
        jiaGe:"",
      };
    },methods: {
      addProduct() {
        console.log(this.peopertyAdd);
        this.shopAdd.peopertyId = this.peopertyAdd.typeId;

        //sku数据
        /* console.log(this.tableSkuData);*/
        //非sku的数据
        /*   console.log(this.notSkuData);*/
        let attrs = [];
        for (let i = 0; i < this.notSkuData.length; i++) {
          let attdata = {};
          attdata[this.notSkuData[i].peopertyId] = this.notSkuData[i].ckValues;
          attrs.push(attdata);
        }
        console.log(attrs);
        //将sku的属性放到shopAdd 对象中
        this.shopAdd.sku = JSON.stringify(this.tableSkuData);
        //将非sku的属性放到shopAdd 对象中
        this.shopAdd.attr = JSON.stringify(attrs);
        console.log(this.$qs.stringify(this.shopAdd));
        this.$axios.post("http://localhost:8080/api/shop/addShop", this.$qs.stringify(this.shopAdd)).then(rs => {
          this.$message.success("添加成功");
        }).catch(err => console.log("新增数据失败"))
      },
      /* 笛卡尔积    */
      calcDescartes: function (array) {
        if (array.length < 2) return array[0] || [];
        return [].reduce.call(array, function (col, set) {
          var res = [];
          col.forEach(function (c) {
            set.forEach(function (s) {
              var t = [].concat(Array.isArray(c) ? c : [c]);
              t.push(s);
              res.push(t);
            })
          });
          return res;
        });
      },
      /* notSkuChange(){
       /!* console.log(this.notSkuData);*!/
        for (let i = 0; i <this.notSkuData.length ; i++) {
          let no=this.notSkuData[i].notValues;

          let pd=this.notSkuData[i].peopertyId;
         /!* console.log(this.notSkuData[i].peopertyId);*!/
         this.sk='{"'+pd+'":"'+no+'"}' ;   //{"pd":"no"}
         console.log(this.sk);

        }
      },*/
      //监听sku属性 改变事件
      skuChange: function () {
            //强制刷新组件
        this.$forceUpdate();
        //笛卡尔积的参数
        let kdej = [];
        //清空表格数据
        this.tableSkuData = [];
        //清空动态表头数据
        this.cols = [];
        //判断是否要生成笛卡尔积
        let flag = true;
        //遍历sku所有数据
        for (let i = 0; i < this.skuData.length; i++) {
          //将sku属性 放入动态表头中
          this.cols.push({
            "id": this.skuData[i].id,
            "nameCH": this.skuData[i].peopertyName,
            "name": this.skuData[i].peopertyId
          });
          //将此属性选中的选项值放入笛卡尔积参数中
          //得到当前sku选中的值  颜色  选中的值 [红色,绿色]    尺寸 [l,x]
          kdej.push(this.skuData[i].ckValues);
          //判断此sku的复选框是否为选中
          if (this.skuData[i].ckValues.length == 0) {
            flag = false;
            break;
          }
        }
        if (flag == true) {
          /*debugger;*/
          let datas = this.calcDescartes(kdej);
          for (let i = 0; i < datas.length; i++) {
            //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]
            //笛卡尔积 转为json的对象
            let jsonData = {}; //笛卡尔积 转为json的对象
            for (let j = 0; j < datas[i].length; j++) {
              //获取数据的key
              let key = this.cols[j].name;
              jsonData[key] = datas[i][j]

            }
            this.tableSkuData.push(jsonData);
          }
          /*console.log(this.tableSkuData);*/
          /*console.log(datas);*/
        }
        this.tableShow = flag;
      },
      //图片上传的回调函数
      imgCallBack: function (response, file, fileList) {
        // 赋值
        this.shopAdd.imgpath = response.data;
      },
      next() {
        if (this.active++ > 3) this.active = 1;
      },
      pre() {
        if (this.active-- < 2) this.active = 1;
      },
      getTypeData() {
        this.$axios.get("http://localhost:8080/api/type/getData").then(rs => {
          //定义的数据     TypeDatas 等于查询出来的所有数据
          this.TypeDatas = rs.data.data;
          //查看有没有子节点数据
          this.getChildrenType();
          for (let i = 0; i < this.TypeData.length; i++) {
            this.typeName = "";
            this.diGui(this.TypeData[i]);
            //给name重新赋值
            this.TypeData[i].name = this.typeName.split("/").reverse().join("/").substr(0, this.typeName.length - 1);

          }
        }).catch(err => {
          console.log("查询类型失败")
        })
      },
      diGui(node) {
        if (node.pid != 0) { //临界值
          this.typeName += "/" + node.name;
          //上级节点
          for (let i = 0; i < this.TypeDatas.length; i++) {
            if (node.pid == this.TypeDatas[i].id) {
              this.diGui(this.TypeDatas[i]);
              break;
            }
          }

        } else {
          this.typeName += "/" + node.name;
        }
      },
      getChildrenType: function () {
        //遍历所有的节点数据
        for (let i = 0; i < this.TypeDatas.length; i++) {
          //节点中所有数据的一条
          let node = this.TypeDatas[i];
          //判断有没有子节点
          this.isChildrenNode(node);
        }
      },
      isChildrenNode: function (node) {
        let rs = true; //标示
        for (let i = 0; i < this.TypeDatas.length; i++) {
          //如果数据的id有指向所有数据的pid 证明是下面还有节点的
          if (node.id == this.TypeDatas[i].pid) {
            rs = false;
            break;
          }
        }
        if (rs == true) {
          //将数据放到表中需要的字段中
          this.TypeData.push(node);
        }
      },
      selectChange(val) {
        this.$axios.get("http://localhost:8080/api/peoperty/queryAllByTypeId?typeId=" + val).then(rs => {
        /*  console.log(rs.data);*/
            this.skuData=rs.data.data.skudatas;
          console.log(this.skuData);
          for (let i = 0; i <this.skuData.length ; i++) {
            this.skuData[i].ckValues=[];
          }
          console.log(this.skuData);
           this.notSkuData=rs.data.data.notSkudatas;
          for (let i = 0; i <this.notSkuData.length ; i++) {
              if(this.notSkuData[i].peopertyType==2){
                  this.notSkuData[i].ckValues=[];
              }
          }
        })
      }
    },
    created(){
      this.$axios.get("http://localhost:8080/api/brand/queryAllBrandData").then(rs=>{
        this.BrandData=rs.data;
        this.getTypeData();
      }).catch(err=>{console.log("查询品牌信息失败")});

    },
  }
</script>
<style>
  .tbody{
    width:80%;
    margin-left:10%;
    margin-top: 2%;

  }
</style>
